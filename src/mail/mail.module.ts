import { MailService } from './mail.service';
import { MailModuleOptions } from './mail.interface';
import { CONFIG_OPTIONS } from './../common/common.constants';
import { Module, DynamicModule, Global } from '@nestjs/common';

@Module({})
@Global()
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
