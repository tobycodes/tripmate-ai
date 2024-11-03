import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, createUserSchema, UpdateUserDto, updateUserSchema } from './user.schemas';
import { ConflictError, NotFoundError } from 'src/kernel/errors';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async create(user: CreateUserDto): Promise<User> {
    const parsedUser = createUserSchema.parse(user);
    const existingUser = await this.repo.findOneBy({ email: parsedUser.email });

    if (existingUser) {
      throw new ConflictError(`User with email ${parsedUser.email} already exists`);
    }

    const newUser = this.repo.create(parsedUser);

    return this.repo.save(newUser);
  }

  async update(id: string, user: UpdateUserDto): Promise<User | null> {
    const existingUser = await this.get(id);
    const parsedUser = updateUserSchema.parse(user);

    Object.assign(existingUser, parsedUser);

    return this.repo.save(existingUser);
  }

  async safeGet(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  async getFullUserByEmail(email: string) {
    const user = await this.repo.createQueryBuilder('u').select('*').where('u.email = :email', { email }).getRawOne();

    if (!user) {
      throw new NotFoundError(`User with email ${email} not found`);
    }

    return user;
  }

  async get(id: string): Promise<User> {
    const user = await this.safeGet(id);

    if (!user) {
      throw new NotFoundError(`User ${id} not found`);
    }

    return user;
  }

  async safeGetByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.safeGetByEmail(email);

    if (!user) {
      throw new NotFoundError(`User with email ${email} not found`);
    }

    return user;
  }

  async reject(id: string): Promise<void> {
    const user = await this.get(id);
    await this.repo.update(user.id, { isApproved: false });
  }

  async approve(id: string): Promise<void> {
    const user = await this.get(id);
    await this.repo.update(user.id, { isApproved: true });
  }

  async count(): Promise<number> {
    return this.repo.count();
  }
}
