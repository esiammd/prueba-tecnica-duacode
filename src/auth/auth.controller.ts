import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request as Req,
  UseInterceptors,
} from '@nestjs/common';
import { type Request } from 'express';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { type User } from 'src/users/entities/user.entity';
import { UserRole } from './enums/user-role.enum';
import { Auth } from './decorators/auth.decorator';

interface IRequestWithUser extends Request {
  user: Pick<User, 'email' | 'role'>;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<Pick<User, 'name' | 'email'>> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return await this.authService.login(loginDto);
  }

  @Get('profile')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @UseInterceptors(ClassSerializerInterceptor)
  async profile(@Req() request: IRequestWithUser): Promise<User> {
    return await this.authService.profile(request.user);
  }
}
