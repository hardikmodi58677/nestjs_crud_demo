import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { ClassroomModule } from './classroom/classroom.module';
import { FileModule } from "./file/file.module";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    ConfigModule,
    ClassroomModule,
    FileModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        poolSize:10,
        keepConnectionAlive:false,
        synchronize: config.get('NODE_ENV') === 'development',
        ssl:true
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AuthService, AppService],
})
export class AppModule {}