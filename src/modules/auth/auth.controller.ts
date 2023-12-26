import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { SignInReqDto,SignInResDto, signInErrorResDto } from "./dtos";

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'User signed in.', type: SignInResDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.',type:signInErrorResDto })
  async signIn(@Body() signInDto: SignInReqDto) {
    const { username, password } = signInDto;
    return this.authService.signIn(username, password);
  }
}