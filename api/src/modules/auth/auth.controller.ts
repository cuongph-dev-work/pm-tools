import { Public } from '@decorators/auth.decorator';
import { CurrentUser } from '@decorators/current-user.decorator';
import { User } from '@entities/user.entity';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  signIn(@CurrentUser() user: User) {
    return this.authService.signIn(user);
  }

  // @Get('user-info')
  // userInfo(@Req() req: RequestWithUser) {
  //   return this.authService.userInfo(req.user);
  // }

  // @Patch('password/change')
  // changePassword(@Body() body: ChangePasswordDto, @Req() req: RequestWithUser) {
  //   return this.authService.changePassword(body, req.user);
  // }

  // @Public()
  // @Patch('password/reset')
  // resetPassword(@Body() body: ResetPasswordDto) {
  //   return this.authService.resetPassword(body);
  // }

  // @Public()
  // @Patch('password/set-first')
  // setFirstPassword(@Body() body: SetFirstPasswordDto) {
  //   return this.authService.setFirstPassword(body);
  // }
}
