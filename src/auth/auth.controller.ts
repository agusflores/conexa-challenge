import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignUpDTO } from '@/auth/dto/sign-up-user.dto';
import { SignInDTO } from '@/auth/dto/sign-in-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: SignUpDTO) {
    return this.authService.signUp(dto);
  }

  @Post('login')
  login(@Body() dto: SignInDTO) {
    return this.authService.signIn(dto);
  }
}
