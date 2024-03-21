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
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Duacoder } from '../duacoders/entities/duacoder.entity';
import { Auth } from './decorators/auth.decorator';
import { DuacoderRole } from '../common/enums/duacoder-role.enum';
import { ActiveDuacoder } from '../common/decorators/active-duacoder.decorator';
import { IDuacoderActive } from '../common/interfaces/active-duacoder.interface';
import { TokenDto } from './dto/token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'Duacoder created successfully.',
    type: Duacoder,
  })
  @ApiBadRequestResponse({ description: 'Bad Request Response API.' })
  @ApiConflictResponse({
    description: 'NIF or Email already registered.',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() registerDto: RegisterDto): Promise<Duacoder> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiCreatedResponse({
    description: 'Authentication route return a token.',
    type: TokenDto,
  })
  @ApiUnauthorizedResponse({ description: 'Email or password invalid.' })
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    return await this.authService.login(loginDto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Displays the requested duacoder.',
    type: Duacoder,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Bearer Auth.' })
  @ApiForbiddenResponse({ description: 'Forbidden access.' })
  @Auth(DuacoderRole.USER)
  @UseInterceptors(ClassSerializerInterceptor)
  async profile(
    @ActiveDuacoder() duacoder: IDuacoderActive,
  ): Promise<Duacoder> {
    return await this.authService.profile(duacoder);
  }
}
