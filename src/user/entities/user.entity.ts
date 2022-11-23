import { CoreEntity } from './../../common/entities/core.entity';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

const salt = bcrypt.genSaltSync(10);

export enum UserRole {
  Admin = 'Admin',
  Member = 'Member',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsEmail()
  email: string;

  @Field((type) => String)
  @Column()
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

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashEmail(): Promise<void> {
    try {
      this.email = await bcrypt.hash(this.email, salt);
      console.log(this.email);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
