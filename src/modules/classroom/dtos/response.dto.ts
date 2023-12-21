
import { ApiProperty } from '@nestjs/swagger';

export class ClassRoomDataResDto {
  @ApiProperty({
    type: String,
    description: 'Name of the classroom',
    example: 'Science',
  })
  name: string;

  @ApiProperty({
    type: Number,
    description: 'ID of the tutor',
    example: 15,
  })
  tutorId: number;

  @ApiProperty({
    type: Number,
    description: 'ID of the classroom',
    example: 5,
  })
  id: number;
}

export class ClassRoomCreatedResDto {
  @ApiProperty({
    type: String,
    description: 'Message of the response',
    example: 'Classroom created successfully',
  })
  message: string;

  @ApiProperty({
    type: Boolean,
    description: 'Status of the response',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: typeof ClassRoomDataResDto,
    description: 'Data of the response',
  })
  data: ClassRoomDataResDto;
}

export class StudentDto{
  @ApiProperty({
    type: Number,
    description: 'ID of the student',
    example: 15,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Username of the student',
    example: 'john',
  })
  username: string;

  @ApiProperty({
    type: String,
    description: 'Role of the student',
    example: 'student',
  })
  role: string;
}

export class GetStudentsInClassroomResDto{
  @ApiProperty({
    type: [StudentDto],
    description: 'Data of the response',
  })
  students: StudentDto[];
}


