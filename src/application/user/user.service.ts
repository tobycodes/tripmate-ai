import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, createUserSchema, UpdateUserDto, updateUserSchema } from './user.schemas';
import { ConflictError, NotFoundError } from 'src/kernel/errors';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(user: CreateUserDto): Promise<User> {
    const parsedUser = createUserSchema.parse(user);
    const existingUser = await this.userRepository.findOneBy({ email: parsedUser.email });

    if (existingUser) {
      throw new ConflictError(`User with email ${parsedUser.email} already exists`);
    }

    const newUser = this.userRepository.create(parsedUser);

    return this.userRepository.save(newUser);
  }

  async update(id: string, user: UpdateUserDto): Promise<User | null> {
    const existingUser = await this.getOrThrow(id);
    const parsedUser = updateUserSchema.parse(user);

    Object.assign(existingUser, parsedUser);

    return this.userRepository.save(existingUser);
  }

  async get(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async getOrThrow(id: string): Promise<User> {
    const user = await this.get(id);

    if (!user) {
      throw new NotFoundError(`User ${id} not found`);
    }

    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async getByEmailOrThrow(email: string): Promise<User> {
    const user = await this.getByEmail(email);

    if (!user) {
      throw new NotFoundError(`User with email ${email} not found`);
    }

    return user;
  }

  async reject(id: string): Promise<void> {
    const user = await this.getOrThrow(id);
    await this.userRepository.update(user.id, { isApproved: false });
  }

  async approve(id: string): Promise<void> {
    const user = await this.getOrThrow(id);
    await this.userRepository.update(user.id, { isApproved: true });
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }
}
