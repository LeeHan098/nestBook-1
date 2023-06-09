import { Body, Controller, Param, Post, Query, Get } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmail } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.userService.createUser(name, email, password);
  }
  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmail): Promise<string> {
    const { signupVerifyToken } = dto;
    console.log(dto);
    return this.userService.verifyEmail(signupVerifyToken);
  }
  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    return await this.userService.login(email, password);
  }
  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    return await this.userService.getUserInfo(userId);
  }
}
