import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "../user/users.module"
import { AuthGuard } from "./auth.guard";

@Module({
  imports: [ConfigModule,UsersModule],
  controllers: [AuthController],
  providers: [AuthService,AuthGuard],
  exports: [AuthService,AuthGuard]
})
export class AuthModule {}
