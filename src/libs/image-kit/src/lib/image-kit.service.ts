import { Inject, Injectable, Logger } from '@nestjs/common';
const ImageKit = require('imagekit');
import { Express } from 'express';
import { Multer } from 'multer';

import { ImageKitConfig } from './image-kit.interface';
import { MODULE_OPTIONS_TOKEN } from './image-kit.module.definition';

@Injectable()
export class ImageKitService {
  private logger: Logger;
  private imagekit: typeof ImageKit;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly config: ImageKitConfig
  ) {
    this.logger = new Logger(ImageKitService.name);
  }

  onModuleInit() {
    this.imagekit = new ImageKit(this.config.imageKit);
  }
  async uploadObject(
    file: Buffer,
    fileName: string,
    folder = 'toddle-demo',
    isPrivateFile = true
  ) {
    const { filePath, fileType, fileId } = await this.imagekit.upload({
      file: file,
      fileName: fileName,
      folder,
      isPrivateFile,
    });
    return { filePath, fileType, fileId };
  }

  getSignedUrl(path: string): string {
    const url = this.imagekit.url({
      path,
      signed: true,
      expireSeconds: 600,
    });
    return url;
  }

  async deleteImage(fileId: string) {
    await this.imagekit.deleteFile(fileId);
  }
}
