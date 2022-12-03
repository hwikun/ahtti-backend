import { DeleteUserOutput, DeleteUserInput } from './dtos/delete-user.dto';
import {
  UpdateProfileInput,
  UpdateProfileOutput,
} from './dtos/update-profile.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { JwtService } from './../jwt/jwt.service';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser({
    email,
    password,
    username,
    confirmPassword,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      // username check & email checka

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

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const users = await this.users.find({
        select: ['id', 'email', 'password'],
      }); // typeORM select id, email from users
      const user = users.find((user) => bcrypt.compareSync(email, user.email)); // in array, find user matched email with hash, result { all of users }
      if (!user) {
        throw new Error();
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Password is incorrect. Please check your password.',
        };
      }
      const token = this.jwtService.sign(user.id);
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

  async findById(id: number): Promise<User> {
    return this.users.findOneBy({ id });
  }

  async userProfile({ userId }: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.findById(userId);
      if (!user) {
        throw new Error();
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'User not found',
      };
    }
  }

  /** 이메일 해시화 확인함수(임시)
   * @param  {User} authUser
   * @param  {VerifyEmailInput} {email}
   * @returns Promise
   */
  async verifyEmail({ email }: VerifyEmailInput): Promise<VerifyEmailOutput> {
    try {
      const users = await this.users.find({
        select: ['id', 'email'],
      }); // typeORM select id, email from users
      const user = users.find((user) => bcrypt.compareSync(email, user.email)); // in array, find user matched email with hash, result { all of users }
      if (!user) {
        return {
          ok: false,
          error: 'Could not found account',
        };
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not verify email',
      };
    }
  }

  async updateProfile(
    authUser: User,
    { email, username, password, updatePassword }: UpdateProfileInput,
  ): Promise<UpdateProfileOutput> {
    try {
      if (!password) {
        return {
          ok: false,
          error: 'Please enter the password',
        };
      }
      const user = await this.users.findOne({
        where: { id: authUser.id },
        select: ['id', 'email', 'password', 'username'],
      });
      if (!user) {
        return {
          ok: false,
          error: 'account not found',
        };
      }
      const correctPassword = await user.checkPassword(password);
      if (!correctPassword) {
        return {
          ok: false,
          error: 'Please check your password',
        };
      }
      if (email) {
        user.email = email;
      }
      if (updatePassword) {
        user.password = updatePassword;
      }
      if (username) {
        user.username = username;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not update profile',
      };
    }
  }

  async deleteUser(
    authUser: User,
    { userId }: DeleteUserInput,
  ): Promise<DeleteUserOutput> {
    try {
      const user = await this.users.findOneBy({ id: userId });
      if (!user) {
        return {
          ok: false,
          error: 'Could not found account',
        };
      }
      if (user.id !== authUser.id) {
        return {
          ok: false,
          error: "You can't delete an account that you don't own",
        };
      }
      await this.users.delete(userId);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not delete account',
      };
    }
  }
}
