import { ApiProperty } from '@nestjs/swagger';
export class UploadFileSuccessResDto {
  @ApiProperty({ example: 'File uploaded successfully' })
  message: string;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'image.png' })
  name: string;

  @ApiProperty({ example: 'This is a test file' })
  description: string;

  @ApiProperty({ example: '2023-12-21T09:10:30.167Z' })
  uploadedAt: string;

  @ApiProperty({ example: 'https://ik.imagekit.io/hbkfhnmfk/tutors/15/image_1703149827876_Rw0snu9Se.png' })
  url: string;

  @ApiProperty({ example: 'john' })
  uploadedBy: string;

  @ApiProperty({ example: 'Image' })
  fileType: string;

  @ApiProperty({ example: 24 })
  id: number;

  @ApiProperty({ example: 1 })
  classroomId: number;
}

export class FileDataDto{
  @ApiProperty({ example: 'File uploaded successfully',
  type: UploadFileSuccessResDto
 })
  files:[UploadFileSuccessResDto];
}

export class GetFilesSuccessResDto {
  @ApiProperty({ example: 'File retrieved successfully' })
  message: string;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    example: {
        files:[{
          name: 'test.png',
          description: 'test',
          uploadedAt: '2021-10-15T10:32:20.000Z',
          uploadedBy: 'john',
          url: 'https://ik.imagekit.io/3qmd5lfj7n/tutors/1/test.png',
          fileType: 'image/png',
          id: 1,
        }]
    },
  })
  data: FileDataDto
}

