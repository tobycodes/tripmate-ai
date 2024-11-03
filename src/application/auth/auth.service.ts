import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CryptoAdapter } from 'src/infrastructure/crypto/crypto.adapter';
import { ArgumentInvalidError, ConflictError, OperationError } from 'src/kernel/errors';
import { AccessService } from '../access/access.service';
import { JwtUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly crypto: CryptoAdapter,
    private readonly accessService: AccessService,
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
    return this.jwtService.sign(payload);
  }

  async register(email: string, password: string, authToken: string) {
    try {
      await this.jwtService.verifyAsync(authToken);
    } catch (error) {
      throw new ArgumentInvalidError('Invalid registration token');
    }

    const existingUser = await this.userService.getByEmail(email);
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

    const payload: JwtUser = { id: user.id, email: user.email, isApproved: user.isApproved };
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<JwtUser> {
    return this.jwtService.verify(token);
  }
}
