import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../user/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '../user/enums/role.enum';
import {
  FileUploadDto,
  UploadFileSuccessResDto,
  GetFilesSuccessResDto,
  FileDataDto,
  RenameFileReqDto,
} from './dtos';
import { FileService } from './file.service';
import { validateAllowedFileTypes } from "../../utils"
import { RolesGuard } from "../user/guards/role.guard";
import { AuthGuard } from "../auth/auth.guard";

@Controller('files')
@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class FileController {
  constructor(private filesService: FileService) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiConsumes('multipart/form-data')
  @Post('/upload')
  @UseGuards(RolesGuard)
  @Roles(Role.Tutor)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File uploaded successfully',
    type: UploadFileSuccessResDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Only audio, video, image, and url files are allowed!',
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', { fileFilter: validateAllowedFileTypes }),
  )
  async uploadFile(
    @Request() req: Express.Request & { fileValidationError: string },
    @UploadedFile() file: Express.Multer.File,
    @Body() fileUploadDto: FileUploadDto,
    @Query('classroomId') classroomId: number,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }

    return this.filesService.uploadFile(req, +classroomId, file, fileUploadDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Tutor, Role.Student)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of files',
    type: GetFilesSuccessResDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Only audio,video, image,and url files are allowed!',
  })
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'classroomId', required: false, type: Number })
  @ApiQuery({ name: 'searchTerm', required: false, type: String })
  getFiles(
    @Request() req: Express.Request,
    @Query('classroomId') classroomId?: number,
    @Query('searchTerm') searchTerm?: string,
  ) {
    return this.filesService.getFiles(req, +classroomId, searchTerm);
  }

  @Get(':fileId')
  @UseGuards(RolesGuard)
  @Roles(Role.Tutor, Role.Student)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File details',
    type: GetFilesSuccessResDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'File not found!',
  })
  @HttpCode(HttpStatus.OK)
  getFile(@Request() req: Express.Request, @Param('fileId') fileId: number) {
    return this.filesService.getFile(req, +fileId);
  }

  @Delete(':fileId')
  @UseGuards(RolesGuard)
  @Roles(Role.Tutor)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'File not found!' })
  @HttpCode(HttpStatus.OK)
  deleteFile(@Param('fileId') fileId: number) {
    return this.filesService.deleteFile(fileId);
  }

  @Put(':fileId')
  @UseGuards(RolesGuard)
  @Roles(Role.Tutor)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File renamed successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'File not found!',
    type: FileDataDto,
  })
  @HttpCode(HttpStatus.OK)
  renameFile(
    @Param('fileId') fileId: number,
    @Body() fileData: RenameFileReqDto,
  ) {
    return this.filesService.renameFile(fileId, fileData);
  }
}
