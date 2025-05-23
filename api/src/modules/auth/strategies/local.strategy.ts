import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import { validate as classValidate } from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { SignInDTO } from '../dtos/sign-in.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private i18n: I18nService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request & { clientIp: string }) {
    const body = plainToClass(SignInDTO, req.body);
    const errors = await classValidate(body);
    if (errors.length) {
      throw new BadRequestException(this.i18n.t('message.wrong_account'));
    } else {
      const { email, password } = req.body;
      // const ip_address = req.clientIp || req.ip || req.socket.remoteAddress;
      // const user_agent = req.headers['user-agent'];

      const user = await this.authService.getAuthenticatedUser(email, password);

      return user;
    }
  }
}
