import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadDto, RenameFileReqDto } from "./dtos"
import {
  Classroom,
  ClassroomFiles,
  ClassroomStudents,
  File,
} from '../classroom/entities';
import { Equal, Like, Repository } from 'typeorm';
import { ImageKitService } from 'src/libs/image-kit/src';
import { ConfigService } from '@nestjs/config';
import { Role } from '../user/enums/role.enum';
import { User } from "../user/entities";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
    @InjectRepository(ClassroomStudents)
    private classroomStudentsRepository: Repository<ClassroomStudents>,
    @InjectRepository(ClassroomFiles)
    private classroomFilesRepository: Repository<ClassroomFiles>,
    @InjectRepository(File) private filesRepository: Repository<File>,
    private imagekitService: ImageKitService,
    private configService: ConfigService,
  ) {}

  async uploadFile(
    req: Express.Request,
    classroomId: number,
    file: Express.Multer.File,
    data: FileUploadDto,
  ): Promise<any> {
    const classroom = await this.classroomRepository.findOne({
      where: { id: classroomId, tutorId: req['user'].id },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    const isPrivateFile = false;
    const { filePath, fileType, fileId } =
      await this.imagekitService.uploadObject(
        file.buffer,
        `${file.originalname.split('.')[0]}_${Date.now()}.${
          file.originalname.split('.')[1]
        }`,
        `tutors/${req['user'].id}`,
        isPrivateFile,
      );

    const fileDetails = {
      name: file.originalname,
      description: data.description,
      uploadedAt: new Date().toISOString(),
      url: this.configService.get<string>('IMAGEKIT_URL_ENDPOINT') + filePath,
      uploadedBy: req['user'].id,
      fileType: data.fileType,
      fileDetails: {
        fileType,
        fileId,
      },
    };

    const uploadedFile = await this.filesRepository.save(fileDetails);
    // const signedUrl = await this.imagekitService.getSignedUrl(filePath);

    await this.classroomFilesRepository.save({
      classroomId,
      fileId: uploadedFile.id,
      tutorId: req['user'].id,
    });

    Object.assign(fileDetails, { uploadedBy: req['user'].username });
    delete fileDetails.fileDetails;

    return {
      message: 'File uploaded successfully',
      success: true,
      data: uploadedFile,
    };
  }

  async getFiles(req: Express.Request, classroomId?: number, searchTerm?: string) {
    let whereClause: any = {
    };

    if (classroomId) {
      whereClause.classroomId = classroomId;
    }

    if (searchTerm) {
      whereClause.name = Like(`%${searchTerm}%`);
    }

    let classroom;
    if (classroomId) {
      classroom = await this.classroomRepository.findOne({
        where: { id: classroomId },
      });

      if (!classroom) {
        throw new NotFoundException('Classroom not found');
      }
    }

    let files = await this.filesRepository.find({
      where: whereClause,
      relations: ['uploadedBy'],
    });

    let filesArr = files.map((f) => {
      return {
        name: f.name,
        description: f.description,
        classroomId: f.classroomId,
        id: f.id,
        uploadedAt: f.uploadedAt,
        uploadedBy: (f['uploadedBy'] as unknown as User).username,
        file_path:
          this.configService.get<string>('IMAGEKIT_URL_ENDPOINT') +
          f.url,
      };
    });

    if (req['user'].role === Role.Tutor) {
      return {
        message: 'List of files',
        success: true,
        data: {
          files: filesArr,
        },
      };
    }

    if (classroomId) {
      whereClause = {
        classroomId
      }
      let studentClassroom = await this.classroomStudentsRepository.findOne({
        where: {...whereClause,studentId: req['user'].id}
      });

      if (!studentClassroom) {
        throw new NotFoundException('Student not found in classroom');
      }
    }

    // Find list of classrooms where student is enrolled
    let studentClassrooms = await this.classroomStudentsRepository.find({
      where: { studentId: req['user'].id },
      select: ['classroomId'],
    });
    const studentClassroomIds = studentClassrooms.map((c) => c.classroomId);
    filesArr = filesArr.filter((f) => {
      return studentClassroomIds.includes(f.classroomId);
    });

    return {
      message: 'List of files',
      success: true,
      data: {
        files: filesArr,
      },
    };
  }

  async getFile(req: Express.Request, fileId: number) { 
    if((req['user'].role == Role.Student)){
      let classroomFile = await this.classroomFilesRepository.findOne({
        where: { fileId: Equal(fileId) },
        relations: ['fileId'],
      });

      if (!classroomFile) {
        throw new NotFoundException('File not found');
      }

      let studentClassroom = await this.classroomStudentsRepository.findOne({
        where: {
          classroomId: classroomFile.classroomId,
          studentId: req['user'].id,
        },
      });

      if (!studentClassroom) {
        throw new NotFoundException('Student not found in classroom');
      }

      return {
        message: 'File details',
        success: true,
        data: {
          file: {
            id: (classroomFile['fileId'] as any)?.id,
            name: (classroomFile['fileId'] as any)?.name,
            description: (classroomFile['fileId'] as any)?.description,
            uploadedAt: (classroomFile['fileId'] as any)?.uploadedAt,
            uploadedBy: (classroomFile['tutorId'] as any)?.username,
            file_path:
              this.configService.get<string>('IMAGEKIT_URL_ENDPOINT') +
              (classroomFile['fileId'] as any)?.url,
          },
        },
      };
    }
    let file = await this.filesRepository.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return {
      message: 'File details',
      success: true,
      data: {
        file: {
          id: file.id,
          name: file.name,
          description: file.description,
          uploadedAt: file.uploadedAt,
          uploadedBy: file.uploadedBy,
          file_path:
            this.configService.get<string>('IMAGEKIT_URL_ENDPOINT') + file.url,
        },
      },
    };
  }

  async deleteFile(fileId: number) {
    let classroomFile = await this.classroomFilesRepository.findOne({
      where: { fileId: Equal(fileId) },
      relations: ['fileId'],
    });

    if (!classroomFile) {
      throw new NotFoundException('File not found');
    }

    await this.classroomFilesRepository.manager.transaction(async (manager) => {
      await manager.delete(ClassroomFiles, {
        classroomId: classroomFile.classroomId,
        fileId: fileId,
      });

      await manager.delete(File, {
        id: fileId,
      });
    });

    console.log('classroomFile', classroomFile)

    await this.imagekitService.deleteImage(
      (classroomFile['fileId'] as any).fileDetails.fileId,
    );

    return {
      message: 'File deleted successfully',
      success: true,
      data: {
        file: {
          id: (classroomFile['fileId'] as any)?.id,
          name: (classroomFile['fileId'] as any)?.name,
          description: (classroomFile['fileId'] as any)?.description,
        },
      },
    };
  }

  async renameFile(fileId: number,fileData:RenameFileReqDto ) {
    let file = await this.filesRepository.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.filesRepository.update(
      { id: fileId },
      {
        name: fileData.name.toLowerCase(),
      },
    );
    const updatedFile = await this.filesRepository.findOne({
      where: { id: fileId },
    });

    return {
      message: 'File renamed successfully',
      success: true,
      data: {
        file: {
          id: file.id,
          name: updatedFile.name,
          description: updatedFile.description,
        },
      },
    };
  }

}
