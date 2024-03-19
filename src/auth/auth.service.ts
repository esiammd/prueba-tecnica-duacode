import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { type RegisterInputDto } from './dto/register-input.dto';
import { type LoginInputDto } from './dto/login-input.dto';
import { type User } from '../users/entities/user.entity';
import { type LoginOutputDto } from './dto/login-output.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({
    name,
    email,
    password,
    role,
  }: RegisterInputDto): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new ConflictException('User already exists');
    }

    return await this.usersService.create({
      name,
      email,
      password: await bcryptjs.hash(password, 10),
      role,
    });
  }

  async login({ email, password }: LoginInputDto): Promise<LoginOutputDto> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email or password invalid');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password invalid');
    }

    const payload = { email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  async profile({ email }: Pick<User, 'email'>): Promise<User> {
    return await this.usersService.findOneByEmail(email);
  }
}
