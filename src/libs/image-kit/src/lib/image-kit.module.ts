import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './image-kit.module.definition';
import { ImageKitService } from './image-kit.service';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [ImageKitService],
  exports: [ImageKitModule, ImageKitService],
})
export class ImageKitModule extends ConfigurableModuleClass {}
