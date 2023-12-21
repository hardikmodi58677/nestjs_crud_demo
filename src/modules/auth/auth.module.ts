import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "src/modules/user/users.module";
import { User } from "src/modules/user/entities/user.entity";

@Module({
  imports: [ConfigModule,UsersModule,User],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
