import { PrismaService } from '@/shared/prisma/prisma.service';
import { SignInDTO } from '@/auth/dto/sign-in-user.dto';
import { SignUpDTO } from '@/auth/dto/sign-up-user.dto';
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDTO: SignUpDTO) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        username: signUpDTO.username,
      },
    });

    if (userExists) {
      throw new ConflictException('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(signUpDTO.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: signUpDTO.username,
        password: hashedPassword,
        role: Role.REGULAR,
      },
    });

    return this.generateToken(user);
  }

  async signIn(signInDTO: SignInDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: signInDTO.username,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const validPassword = await bcrypt.compare(
      signInDTO.password,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.generateToken(user);
  }

  private generateToken(user: { id: string; username: string; role: Role }) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
