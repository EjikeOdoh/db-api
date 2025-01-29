import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { Public } from 'src/decorators/decorators';
import { ApiOkResponse } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { log } from 'console';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOkResponse()
  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    const { sub: id } = req.user
    log(req.user)
    return this.authService.getProfile(id)
  }
}
