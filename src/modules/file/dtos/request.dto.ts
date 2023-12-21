import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

enum FileType {
  Image = 'Image',
  Audio = 'Audio',
  Video = 'Video',
  URL = 'URL',
}

export class FileUploadDto {
  @ApiProperty({
    description: 'Description of file',
    example: 'This is a file',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'File type',
    example: FileType.Image,
    enum: FileType,
  })
  @ApiProperty()
  @IsEnum(FileType)
  fileType: FileType;

  @ApiProperty({
    description: 'File',
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;
}

export class RenameFileReqDto {
  @ApiProperty({
    description: 'File name',
    example: 'newFileName',
  })
  @IsNotEmpty()
  name: string;
}