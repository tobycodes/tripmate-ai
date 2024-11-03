import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CryptoAdapter } from 'src/infrastructure/crypto/crypto.adapter';
import { ArgumentInvalidError, ConflictError, OperationError } from 'src/kernel/errors';
import { AccessService } from '../access/access.service';
import { JwtUser } from './auth.types';
import { EventPublisher } from 'src/infrastructure/events/event.publisher';
import { UserRegisteredEvent } from './auth.events';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly crypto: CryptoAdapter,
    private readonly accessService: AccessService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.getFullUserByEmail(email);

    try {
      const isPasswordValid = await this.crypto.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      throw new OperationError(error.message, error);
    }

    const payload: JwtUser = { id: user.id, email: user.email, isApproved: user.isApproved };
    return this.jwtService.signAsync(payload);
  }

  async register(email: string, password: string, authToken: string) {
    try {
      const data = await this.jwtService.verifyAsync(authToken);

      if (data.email !== email) {
        throw new Error('token email is not request email');
      }
    } catch (error) {
      throw new ArgumentInvalidError('Invalid registration token');
    }

    const existingUser = await this.userService.safeGetByEmail(email);
    if (existingUser) {
      throw new ConflictError('User already exists', { email });
    }

    const accessRequest = await this.accessService.getAccessRequest(email);

    if (!accessRequest) {
      throw new UnauthorizedException('User is not approved', {
        description: 'Please wait for the admin to approve your access request',
      });
    }

    if (accessRequest?.status === 'pending') {
      throw new UnauthorizedException('User is not approved', {
        description: 'Please wait for the admin to approve your access request',
      });
    }

    if (accessRequest?.status === 'rejected') {
      throw new UnauthorizedException('User is not approved', {
        description: 'Your access request has been rejected',
      });
    }

    const hashedPassword = await this.crypto.hash(password);
    const user = await this.userService.create({
      email,
      password: hashedPassword,
      firstName: accessRequest.firstName,
      lastName: accessRequest.lastName,
    });

    await this.userService.approve(user.id);

    this.eventPublisher.publish(
      new UserRegisteredEvent({
        email: user.email,
        firstName: user.firstName,
        userId: user.id,
      }),
    );

    const payload: JwtUser = { id: user.id, email: user.email, isApproved: user.isApproved };
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string): Promise<JwtUser> {
    return this.jwtService.verifyAsync(token);
  }
}
