import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Query } from "@nestjs/common";
export class AddStudentsToClassDto {
  @ApiProperty({
    type: [Number],
    description: 'Array of student IDs',
    example: [1, 2, 3],
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  studentIds: number[];
}

export class CreateClassRoomDto {
  @ApiProperty({
    description: 'Classroom name',
    example: 'Mathematics',
  })
  @IsNotEmpty()
  name: string;
}