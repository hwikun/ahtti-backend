import { LoginInput, LoginOutput } from './dtos/login.dto';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { SALT, User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createUser({
    email,
    password,
    username,
    confirmPassword,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const exists = await this.users.findOneBy({ username });
      if (exists) {
        return {
          ok: false,
          error: 'Account already exists',
        };
      }
      if (password !== confirmPassword) {
        return {
          ok: false,
          error: 'Password is not correct',
        };
      }
      await this.users.save(this.users.create({ email, password, username }));
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not create account',
      };
    }
  }

  async login({ username, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOneBy({ username });
      if (!user) {
        throw new Error();
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Password is incorrect',
        };
      }
      const token = 'aaa';
      return {
        ok: true,
        token,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not login',
      };
    }
  }
}
