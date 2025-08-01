import { Roles } from '@decorators/role.decorator';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto, SearchUserDto, UpdateUserDto } from './dtos';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles([])
  @Post('/')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Roles([])
  @Get('/:id')
  showUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Roles([])
  @Patch('/:id')
  editUserProfile(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(id, body);
  }

  @Roles([])
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Roles([])
  @Get('/')
  getUsers(@Query() query: SearchUserDto) {
    return this.userService.getUsers(query);
  }
}
