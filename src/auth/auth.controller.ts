import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request as Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { type Request } from 'express';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { type User } from 'src/users/entities/user.entity';

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
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async profile(@Req() request: IRequestWithUser): Promise<User> {
    return await this.authService.profile(request.user);
  }
}
