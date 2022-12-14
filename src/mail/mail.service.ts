import { CONFIG_OPTIONS } from './../common/common.constants';
import { Inject, Injectable } from '@nestjs/common';
import { MailModuleOptions, EmailVar } from './mail.interface';
import got from 'got';
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}
  /** email 전송 함수 */
  private async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ) {
    // mailgun template에 담을 payload
    const form = new FormData();
    form.append('from', `Excited User <ahtti@${this.options.domain}>`);
    form.append('to', `leah8608@gmail.com`);
    form.append('subject', `${subject}`);
    form.append('template', template);
    emailVars.forEach((emailVar) =>
      form.append(`v:${emailVar.key}`, emailVar.value),
    );
    try {
      // request 요청
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      });
    } catch (error) {
      console.log(error);
    }
  }
  /** 실제 동작시키는 함수 */
  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify your email', 'confirm-template', [
      { key: 'username', value: email },
      { key: 'code', value: code },
    ]);
  }
}
