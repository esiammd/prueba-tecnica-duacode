import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterInputDto } from './dto/register-input.dto';
import { LoginInputDto } from './dto/login-input.dto';
import { User } from '../users/entities/user.entity';
import { Auth } from './decorators/auth.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { IUserActive } from '../common/interfaces/active-user.interface';
import { LoginOutputDto } from './dto/login-output.dto';
import { RegisterOutputDto } from './dto/register-output.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'User created successfully.',
    type: RegisterOutputDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request Response API.' })
  @ApiConflictResponse({ description: 'User already exists.' })
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() registerDto: RegisterInputDto): Promise<User> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiCreatedResponse({
    description: 'Authentication route return a token.',
    type: LoginOutputDto,
  })
  @ApiUnauthorizedResponse({ description: 'Email or password invalid.' })
  async login(@Body() loginDto: LoginInputDto): Promise<LoginOutputDto> {
    return await this.authService.login(loginDto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Displays the requested user.',
    type: User,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Bearer Auth.' })
  @ApiForbiddenResponse({ description: 'Forbidden access.' })
  @Auth(UserRole.USER)
  @UseInterceptors(ClassSerializerInterceptor)
  async profile(@ActiveUser() user: IUserActive): Promise<User> {
    return await this.authService.profile(user);
  }
}
