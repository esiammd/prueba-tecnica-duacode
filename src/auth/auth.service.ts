import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

import { DuacodersService } from '../duacoders/duacoders.service';
import { type Duacoder } from '../duacoders/entities/duacoder.entity';
import { type RegisterDto } from './dto/register.dto';
import { type LoginDto } from './dto/login.dto';
import { type TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly duacodersService: DuacodersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(RegisterDto: RegisterDto): Promise<Duacoder> {
    return await this.duacodersService.create({
      ...RegisterDto,
      password: await bcryptjs.hash(RegisterDto.password, 10),
    });
  }

  async login({ email, password }: LoginDto): Promise<TokenDto> {
    const duacoder = await this.duacodersService.findOneByEmail(email);

    if (!duacoder) {
      throw new UnauthorizedException('Email or password invalid');
    }

    const isPasswordValid = await bcryptjs.compare(password, duacoder.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password invalid');
    }

    const payload = { email: duacoder.email, role: duacoder.role };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  async profile({ email }: Pick<Duacoder, 'email'>): Promise<Duacoder> {
    return await this.duacodersService.findOneByEmail(email);
  }
}
