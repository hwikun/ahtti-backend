import { Verification } from './entities/verification.entity';
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
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
  ) {}

  /** 회원가입 */
  async createUser({
    email,
    password,
    username,
    confirmPassword,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      // username check & email check
      const emailExists = await this.users.findOneBy({
        email: this.jwtService.hash(email),
      });
      if (emailExists) {
        throw new Error('Email already exists');
      }
      const usernameExists = await this.users.findOneBy({ username });
      if (usernameExists) {
        throw new Error('Username already exists');
      }
      // 패스워드 일치 확인
      if (password !== confirmPassword) {
        throw new Error('Password is not correct. Please check your password');
      }
      const user = await this.users.save(
        this.users.create({ email, password, username }),
      );
      console.log(user);
      // DB 저장
      await this.verifications.save(this.verifications.create({ user }));
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: error ?? 'Could not create account',
      };
    }
  }

  /** 로그인 */
  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      // DB 조회
      const user = await this.users.findOne({
        where: { email: this.jwtService.hash(email) },
        select: ['id', 'email', 'password'],
      });
      console.log(user);
      if (!user) {
        throw new Error('Account not found');
      }
      // 패스워드 확인
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        throw new Error('Password is incorrect. Please check your password.');
      }
      // 토큰 발급
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: error ?? 'Could not login',
      };
    }
  }

  /** 회원 찾기(내부용) */
  async findById(id: number): Promise<User> {
    return this.users.findOneBy({ id });
  }

  /** 프로필 조회 */
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

  /** 프로필 업데이트 */
  async updateProfile(
    userId: number,
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
        where: { id: userId },
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
        user.verified = false;
        await this.verifications.save(this.verifications.create({ user }));
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

  /** 유저 탈퇴(삭제) */
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

  /** 이메일 인증*/
  async verifyEmail({ code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne({
        where: { code },
        relations: ['user'],
      });
      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verifications.delete(verification.id);
        return {
          ok: true,
        };
      }
      throw new Error();
    } catch (error) {
      return {
        ok: false,
        error: 'Could not verify email',
      };
    }
  }
}
