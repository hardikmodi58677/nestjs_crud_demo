import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassRoomDto } from './dtos';
import { Equal, In, Repository } from 'typeorm';
import { Classroom } from './entities/classroom.entity';
import { Role } from 'src/modules/user/enums/role.enum';
import { ClassroomStudents } from './entities/classroom_students.entity';
import { AddStudentsToClassDto } from './dtos/request.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { ImageKitService } from 'src/libs/image-kit/src';
import { File } from './entities/file.entity';
import { ClassroomFiles } from './entities/classroom_files.entity';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
    @InjectRepository(ClassroomStudents)
    private classroomStudentsRepository: Repository<ClassroomStudents>,
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  async createClassroom(
    req: Express.Request,
    createClassroomDto: CreateClassRoomDto,
  ) {
    createClassroomDto['tutorId'] = req['user'].id;
    createClassroomDto['name'] = createClassroomDto.name.toLowerCase();
    const isClassroomExists = await this.classroomRepository.findOne({
      where: { name: Equal(createClassroomDto.name) },
    });

    if (isClassroomExists) {
      throw new BadRequestException('Classroom already exists');
    }

    return this.classroomRepository.save(createClassroomDto);
  }

  getClassrooms(user: { username: string; role: string; id: number }) {
    if (user.role === Role.Tutor) {
      return this.classroomRepository.find({ where: { tutorId: user.id } });
    }
    return this.classroomStudentsRepository.find({
      where: { studentId: user.id },
      relations: ['classroom'],
      select: ['classroom'],
    });
  }

  async getClassroomDetails(req: Express.Request, id: number) {
    let classroom = null;
    if (req['user'].role === Role.Student) {
      classroom = await this.classroomStudentsRepository.findOne({
        where: { classroomId: id, studentId: req['user'].id },
        relations: ['classroom'],
      });

      if (!classroom) {
        throw new NotFoundException('Classroom not found');
      }
      return classroom['classroom'];
    }

    classroom = await this.classroomRepository.findOne({
      where: { id, tutorId: req['user'].id },
    });
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    return classroom;
  }

  async addStudentToClassroom(
    req: Express.Request,
    id: number,
    addStudentsDto: AddStudentsToClassDto,
  ) {
    const classroom = await this.classroomRepository.findOne({
      where: { id, tutorId: req['user'].id },
    });
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    const areAllStudents = await this.users.find({
      where: { id: In(addStudentsDto.studentIds), role: Role.Student },
    });
    if (areAllStudents.length !== addStudentsDto.studentIds.length) {
      throw new BadRequestException('Invalid student IDs');
    }

    const studentIds = addStudentsDto.studentIds;
    const classroomStudents = await this.classroomStudentsRepository.find({
      where: { classroomId: id },
      select: ['studentId'],
    });
    const existingStudentIds = classroomStudents.map((cs) => cs.studentId);
    const newStudentIds = studentIds.filter(
      (sid) => !existingStudentIds.includes(sid),
    );
    const newClassroomStudents = newStudentIds.map((sid) => ({
      classroomId: id,
      studentId: sid,
    }));

    await this.classroomStudentsRepository.insert(newClassroomStudents);
    return {
      message: `Students added to classroom successfully`,
      success: true,
      data: {
        classroomId: id,
        studentIds: [...new Set([...existingStudentIds, ...newStudentIds])]
      }
    }
  }

  async getStudentsInClassroom(req: Express.Request, id: number) {
    const classroom = await this.classroomRepository.findOne({
      where: { id, tutorId: req['user'].id },
    });
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }
    const classroomStudents = await this.classroomStudentsRepository.find({
      where: { classroomId: id },
      select: ['studentId'],
    });
    const studentIds = classroomStudents.map((cs) => cs.studentId);
    return { studentIds };
  }

  async deleteClassroom(req: Express.Request, id: number) {
    const classroom = await this.classroomRepository.findOne({
      where: { id, tutorId: req['user'].id },
    });
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }
    await this.classroomRepository.delete(id);
    return {
      message: `Classroom deleted successfully`,
      success: true,
      data: { classroomId: id },
    };
  }

  async removeStudentFromClassroom(
    req: Express.Request,
    id: number,
    studentId: number,
  ) {
    const classroom = await this.classroomRepository.findOne({
      where: { id, tutorId: req['user'].id },
    });
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }
    await this.classroomStudentsRepository.delete({
      classroomId: id,
      studentId: studentId,
    });
    return {
      message: `Student removed from classroom successfully`,
      success: true,
    };
  }
}
