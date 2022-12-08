import { JwtModuleOptions } from './jwt.interface';
import { CONFIG_OPTIONS } from './../common/common.constants';
import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}

  /** jwt 발급 함수 */
  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.options.privateKey);
  }

  /** jwt 검증 */
  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }

  /** email hashing 함수 */
  hash(email: string) {
    return bcrypt
      .hashSync(email, process.env.SALT)
      .replace(process.env.SALT, '');
  }
}
