import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { SignInResDto } from './dtos';
import { Role } from 'src/modules/user/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<SignInResDto > {
    const user = await this.usersService.findOne(username, pass);
    const { password, ...result } = user;

    const jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY');
    const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN');

    const token = sign(
      { username: result.username, role: result.role, id: result.id },
      jwtSecretKey,
      {
        expiresIn: jwtExpiresIn,
      },
    );

    return {
      token,
      success: true,
      data:{
        username:result.username,
        role:result.role,
        id:result.id
      },
      message: 'Login Successful',
    };
  }

  verifyToken(token: string): { username: string; role: Role,id:number } | null {
    try {
      const jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY');
      const decoded = verify(token, jwtSecretKey);
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
