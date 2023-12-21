import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Classroom,
  ClassroomFiles,
  ClassroomStudents,
  File,
} from '../classroom/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Classroom,
      ClassroomStudents,
      ClassroomFiles,
      File,
    ]),
  ],
  providers: [
    FileService,
  ],
  controllers: [FileController],
})
export class FileModule {}
