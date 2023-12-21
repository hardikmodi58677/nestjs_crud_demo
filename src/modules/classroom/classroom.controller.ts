import { Controller, Get, Post, Param, Body, Request, Delete } from '@nestjs/common';
import { ClassroomService } from "./classroom.service";
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/modules/user/decorators/role.decorator";
import { Role } from "src/modules/user/enums/role.enum";
import { AddStudentsToClassDto, CreateClassRoomDto, ClassRoomDataResDto } from "./dtos";


@Controller('classroom')

export class ClassroomController {

  constructor(private classRoomService:ClassroomService) {}

  @ApiTags('Classroom')
  @Post()
  @ApiBearerAuth('jwt-auth')
  @Roles(Role.Tutor)
  @ApiResponse({ status: 201, description: 'Classroom created successfully', type: ClassRoomDataResDto })
  createClassroom(
    @Request() req:Express.Request,
    @Body() createClassroomDto: CreateClassRoomDto) {
    return this.classRoomService.createClassroom(req,createClassroomDto);
  }

  @ApiTags('Classroom')
  @Get()
  @ApiBearerAuth('jwt-auth')
  @Roles(Role.Tutor,Role.Student)
  @ApiResponse({ status: 200, description: 'List of classrooms', type: [ClassRoomDataResDto] })
  getClassrooms(@Request() req:Express.Request) {
    return this.classRoomService.getClassrooms(req['user']);
  }

  @ApiTags('Classroom')
  @Get(":id")
  @ApiBearerAuth('jwt-auth')
  @ApiResponse({ status: 200, description: 'Classroom details', type: ClassRoomDataResDto })
  getClassroomDetails(
    @Request() req:Express.Request,
    @Param('id') id: number) {
    return this.classRoomService.getClassroomDetails(req,+id);
  }

  @ApiTags('Classroom')
  @Delete(":id")
  @ApiBearerAuth('jwt-auth')
  @Roles(Role.Tutor)
  @ApiResponse({ status: 200, description: 'Classroom deleted successfully' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  deleteClassroom(
    @Request() req:Express.Request,
    @Param('id') id: number,
  ) {
    return this.classRoomService.deleteClassroom(req,+id);
  }

  @ApiTags('Classroom-Student')
  @Post(":id/students")
  @ApiBearerAuth('jwt-auth')
  @Roles(Role.Tutor)
  @ApiResponse({ status: 201, description: 'Student added to classroom successfully',type:ClassRoomDataResDto })
  addStudentToClassroom(
    @Request() req:Express.Request,
    @Param('id') id: number,
    @Body() addStudentsDto: AddStudentsToClassDto
    ) {
    return this.classRoomService.addStudentToClassroom(req,+id,addStudentsDto);
  }

  @ApiTags('Classroom-Student')
  @Get(":id/students")
  @ApiBearerAuth('jwt-auth')
  @Roles(Role.Tutor)
  @ApiResponse({ status: 200, description: 'List of students in classroom'  })
  getStudentsInClassroom(
    @Request() req:Express.Request,
    @Param('id') id: number,
    ) {
    return this.classRoomService.getStudentsInClassroom(req,+id);
  }

  @ApiTags('Classroom-Student')
  @Delete(":id/students/:studentId")
  @ApiBearerAuth('jwt-auth')
  @Roles(Role.Tutor)
  @ApiResponse({ status: 200, description: 'Student removed from classroom successfully' })
  removeStudentFromClassroom(
    @Request() req:Express.Request,
    @Param('id') id: number,
    @Param('studentId') studentId: number,
    ) {
    return this.classRoomService.removeStudentFromClassroom(req,+id,+studentId);
  }

}
