import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "../user/users.module"

@Module({
  imports: [ConfigModule,UsersModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
