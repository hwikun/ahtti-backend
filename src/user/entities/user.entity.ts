import { Post } from './../../post/entities/post.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

export enum UserRole {
  Admin = 'Admin',
  Member = 'Member',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

registerEnumType(UserRole, { name: 'UserRole' });
registerEnumType(Gender, { name: 'Gender' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  constructor() {
    super();
  }
  @Field((type) => String)
  @Column({ select: false })
  @IsEmail()
  email: string;

  @Field((type) => String)
  @Column({ select: false })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  @MinLength(6)
  @MaxLength(15)
  username: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Member })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  profileImg?: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  @Field((type) => Gender, { nullable: true })
  @IsEnum(Gender)
  gender?: Gender;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  nationality?: string;

  @Column({ default: 0 })
  @Field((type) => Int)
  @IsInt()
  coin: number;

  // social login

  @Column({ default: false })
  @Field((type) => Boolean)
  verified: boolean;

  @OneToMany((type) => Post, (post) => post.author)
  @Field((type) => [Post])
  posts: Post[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (err) {
        console.log(err);
        throw new InternalServerErrorException();
      }
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashEmail(): Promise<void> {
    if (this.email) {
      try {
        this.email = bcrypt
          .hashSync(this.email, process.env.SALT)
          .replace(process.env.SALT, '');
        console.log(this.email);
      } catch (err) {
        console.log(err);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(password, this.password);
      return ok;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async checkEmail(email: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(email, this.email);
      return ok;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
