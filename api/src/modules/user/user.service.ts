import { ChangePasswordDto, ResetPasswordDto, SetFirstPasswordDto } from '@modules/auth/dtos';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailService } from '@shared/modules/mail/mail.service';
import { addHours } from '@utils/date';
import { generateToken, transformToValidationError } from '@utils/helper';
import { createPaginationResponse } from '@utils/pagination';
import { compare } from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto, SearchUserDto, ShowUserResponseDto, UpdateUserDto } from './dtos';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
    private readonly i18n: I18nService,
    private readonly mailService: MailService,
  ) {}

  private async checkUniqueEmail(email: string) {
    const user = await this.userRepository.findByEmail(email, []);
    if (user) {
      throw transformToValidationError(
        [{ property: 'email', key: 'IsUnique', params: {} }],
        this.i18n,
      );
    }
  }

  /**
   * Find a user by email
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email, ['password']);
  }

  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  /**
   * Create a new user
   */
  async createUser(body: CreateUserDto) {
    // check unique email
    await this.checkUniqueEmail(body.email);
    // create user
    return this.userRepository.createNewUser(body);
  }

  /**
   * Get user by id
   */
  async getUserById(id: string): Promise<ShowUserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(this.i18n.t('message.user_not_found'));
    }
    return plainToInstance(ShowUserResponseDto, user);
  }

  /**
   * Update user
   */
  async updateUser(id: string, body: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(this.i18n.t('message.user_not_found'));
    }
    return this.userRepository.updateUser(user, body);
  }

  /**
   * Delete user
   */
  async deleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(this.i18n.t('message.user_not_found'));
    }
    return this.userRepository.deleteUser(user);
  }

  /**
   * Get users
   */
  async getUsers(query: SearchUserDto) {
    const { data: users, total, pagination } = await this.userRepository.getUsers(query);

    return createPaginationResponse(users, total, pagination.page, pagination.limit);
  }

  /**
   * Change password
   */
  async changePassword(body: ChangePasswordDto, currentUser: User) {
    const { current_password } = body;
    const user = await this.userRepository.findById(currentUser.id, ['password']);

    // check if user exists
    if (!user) {
      throw new NotFoundException(this.i18n.t('message.user_not_found'));
    }

    // check if user has password
    if (!user.password) {
      throw new BadRequestException(this.i18n.t('message.user_not_found'));
    }

    // check current password
    const isMatch = await compare(current_password, user.password);
    if (!isMatch) {
      throw new BadRequestException(this.i18n.t('message.password_incorrect'));
    }

    return this.userRepository.updatePassword(user, body.new_password);
  }

  /**
   * Reset password
   */
  async resetPassword(body: ResetPasswordDto) {
    const { email } = body;
    const user = await this.userRepository.findByEmail(email, []);
    if (!user) {
      throw new NotFoundException(this.i18n.t('message.user_not_found'));
    }

    const resetToken = generateToken();
    const resetTokenExpiredAt = addHours(new Date(), 3);

    await this.userRepository.updateResetToken(user, resetToken, resetTokenExpiredAt.toJSDate());

    await this.mailService.sendPasswordResetMail({
      to: user.email,
      resetToken,
      redirectUrl: body.redirect_url,
    });

    return {
      message: this.i18n.t('message.reset_password_success'),
    };
  }

  /**
   * Verify reset token
   */
  async verifyResetToken(token: string) {
    const user = await this.userRepository.findOne({
      reset_token: token,
      reset_token_expired_at: { $gte: new Date() },
    });

    if (!user) {
      throw new BadRequestException(this.i18n.t('message.invalid_reset_token'));
    }

    return {
      id: user.id,
    };
  }

  /**
   * Set first password
   */
  async setFirstPassword(body: SetFirstPasswordDto) {
    const { token, password } = body;
    const user = await this.userRepository.findOne({
      reset_token: token,
      reset_token_expired_at: { $gte: new Date() },
    });

    if (!user) {
      throw new BadRequestException(this.i18n.t('message.invalid_reset_token'));
    }

    await this.userRepository.updatePassword(user, password);

    return {
      message: this.i18n.t('message.set_first_password_success'),
    };
  }
}
