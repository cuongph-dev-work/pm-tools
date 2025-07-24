import { access_token_private_key, refresh_token_private_key } from '@configs/jwt.constraints';
import { UserService } from '@modules/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/database/entities/user.entity';
import {
  ChangePasswordDto,
  ResetPasswordDto,
  SetFirstPasswordDto,
  UserInfoResponseDto,
} from './dtos';
import { TokenPayload } from './interfaces/token.interface';
@Injectable()
export class AuthService {
  private MAX_FAILED_ATTEMPTS = 10;
  private ATTEMPTS_WINDOW_MINUTES = 30;
  private BLOCK_DURATION_HOURS = 2;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Generate JWT access token
   * @param payload User information to include in token
   * @returns Signed JWT access token
   */
  private generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: access_token_private_key,
      expiresIn: `${this.configService.get<string>('jwt.expiresIn')}`,
    });
  }

  /**
   * Generate JWT refresh token
   * @param payload User information to include in token
   * @returns Signed JWT refresh token
   */
  private generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: refresh_token_private_key,
      expiresIn: `${this.configService.get<string>('jwt.refreshIn')}`,
    });
  }

  /**
   * Validate user from JWT token payload
   * @param payload Token payload containing user information
   * @returns User entity if found, null otherwise
   */
  async validateUser(payload: TokenPayload) {
    return this.userService.findById(payload.sub);
  }

  /**
   * Authenticate user with email and password
   * @param email User's email
   * @param password User's password
   * @param target_model User's target model
   * @throws UnauthorizedException if user not found or password doesn't match
   * @returns Authenticated user entity
   */
  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    const user: User | null = await this.userService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException(this.i18n.t('message.wrong_account'));
    }

    const is_matching = await bcrypt.compare(password, user.password);

    if (!is_matching) {
      throw new UnauthorizedException(this.i18n.t('message.wrong_account'));
    }

    if (user.block_to && user.block_to > new Date()) {
      throw new UnauthorizedException(this.i18n.t('message.account_blocked'));
    }

    return user;
  }

  /**
   * Generate authentication tokens for a user
   * @param user User entity to generate tokens for
   * @returns Object containing tokens and token metadata
   */
  signIn(user: User) {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: '',
    };
    const access_token = this.generateAccessToken(payload);
    const refresh_token = this.generateRefreshToken(payload);
    const decodedToken = this.jwtService.decode(access_token);
    const iat = decodedToken?.iat;
    const exp = decodedToken?.exp;
    return {
      iat,
      exp,
      sub: payload.sub,
      access_token,
      refresh_token,
    };
  }

  /**
   * Get user information
   * @param user User entity to get information for
   * @returns User entity with additional information
   */
  userInfo(user: User): UserInfoResponseDto {
    return plainToInstance(UserInfoResponseDto, user);
  }

  /**
   * Change password
   */
  changePassword(body: ChangePasswordDto, user: User) {
    return this.userService.changePassword(body, user);
  }

  /**
   * Reset password
   */
  resetPassword(body: ResetPasswordDto) {
    return this.userService.resetPassword(body);
  }

  /**
   * Set first password
   */
  setFirstPassword(body: SetFirstPasswordDto) {
    return this.userService.setFirstPassword(body);
  }
}
