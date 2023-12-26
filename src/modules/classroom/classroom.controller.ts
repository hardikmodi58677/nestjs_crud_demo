import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Request,
  Delete,
} from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AddStudentsToClassDto,
  CreateClassRoomDto,
  ClassRoomDataResDto,
  GetStudentsInClassroomResDto,
} from './dtos';
import { Roles } from '../user/decorators/role.decorator';
import { Role } from '../user/enums/role.enum';

@Controller('classrooms')
export class ClassroomController {
  constructor(private classRoomService: ClassroomService) {}

  @ApiTags('Classroom')
  @Post()
  @ApiBearerAuth('jwt-auth')
  @Roles(Role.Tutor)
  @ApiResponse({
    status: 201,
    description: 'Classroom created successfully',
    type: ClassRoomDataResDto,
  })
  createClassroom(
    @Request() req: Express.Request,
    @Body() createClassroomDto: CreateClassRoomDto,
  ) {
    return this.classRoomService.createClassroom(req, createClassroomDto);
  }

  @ApiTags('Classroom')
  @Get()
  @ApiBearerAuth('jwt-auth')
  @Roles(Role.Tutor, Role.Student)
  @ApiResponse({
    status: 200,
    description: 'List of classrooms',
    type: [ClassRoomDataResDto],
  })
  getClassrooms(@Request() req: Express.Request) {
    return this.classRoomService.getClassrooms(req['user']);
  }

  @ApiTags('Classroom')
  @Get(':classroomId')
  @ApiBearerAuth('jwt-auth')
  @ApiResponse({
    status: 200,
    description: 'Classroom details',
    type: ClassRoomDataResDto,
  })
  getClassroomDetails(
    @Request() req: Express.Request,
    @Param('classroomId') classroomId: number,
  ) {
    return this.classRoomService.getClassroomDetails(req, +classroomId);
  }

  @ApiTags('Classroom')
  @Delete(':classroomId')
  @ApiBearerAuth('jwt-auth')
  @Roles(Role.Tutor)
  @ApiResponse({ status: 200, description: 'Classroom deleted successfully' })
  @ApiParam({ name: 'classroomId', description: 'Classroom ID' })
  deleteClassroom(
    @Request() req: Express.Request,
    @Param('classroomId') classroomId: number,
  ) {
    return this.classRoomService.deleteClassroom(req, +classroomId);
  }

  @ApiTags('Classroom-Student')
  @Post(':classroomId/students')
  @ApiBearerAuth('jwt-auth')
  @Roles(Role.Tutor)
  @ApiResponse({
    status: 201,
    description: 'Student added to classroom successfully',
    type: ClassRoomDataResDto,
  })
  addStudentToClassroom(
    @Request() req: Express.Request,
    @Param('classroomId') classroomId: number,
    @Body() addStudentsDto: AddStudentsToClassDto,
  ) {
    return this.classRoomService.addStudentToClassroom(
      req,
      +classroomId,
      addStudentsDto,
    );
  }

  @ApiTags('Classroom-Student')
  @Get(':classroomId/students')
  @ApiBearerAuth('jwt-auth')
  @Roles(Role.Tutor)
  @ApiResponse({
    status: 200,
    description: 'List of students in classroom',
    type: GetStudentsInClassroomResDto,
  })
  getStudentsInClassroom(
    @Request() req: Express.Request,
    @Param('classroomId') classroomId: number,
  ) {
    return this.classRoomService.getStudentsInClassroom(req, +classroomId);
  }

  @ApiTags('Classroom-Student')
  @Delete(':classroomId/students/:studentId')
  @ApiBearerAuth('jwt-auth')
  @Roles(Role.Tutor)
  @ApiResponse({
    status: 200,
    description: 'Student removed from classroom successfully',
  })
  removeStudentFromClassroom(
    @Request() req: Express.Request,
    @Param('classroomId') classroomId: number,
    @Param('studentId') studentId: number,
  ) {
    return this.classRoomService.removeStudentFromClassroom(
      req,
      +classroomId,
      +studentId,
    );
  }
}
