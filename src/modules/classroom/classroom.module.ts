import { Module } from '@nestjs/common';
import { ClassroomController } from './classroom.controller';
import { ClassroomService } from './classroom.service';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from './entities/classroom.entity';
import { ClassroomStudents } from './entities/classroom_students.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { File } from './entities/file.entity';
import { ClassroomFiles } from './entities/classroom_files.entity';
import { User } from "../user/entities";
import { RolesGuard } from "../user/guards/role.guard";
import { ImageKitModule } from "../../libs/image-kit/src"

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Classroom,
      ClassroomStudents,
      User,
      File,
      ClassroomFiles,
    ]),
    ImageKitModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        return {
          imageKit: {
            publicKey: configService.get('IMAGEKIT_PUBLIC_KEY'),
            privateKey: configService.get('IMAGEKIT_PRIVATE_KEY'),
            urlEndpoint: configService.get('IMAGEKIT_URL_ENDPOINT'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [ClassroomController],
  providers: [
    ClassroomService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class ClassroomModule {}
