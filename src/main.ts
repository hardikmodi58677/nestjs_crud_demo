import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Toddle Demo API')
    .setDescription('Demo API for Toddle Assignment')
    .setVersion('1.0')
    .addBearerAuth({
      description: 'Enter JWT token',
      type: 'http',
      name:'Authorization',
      scheme:'bearer',
      in:'header',
    },'jwt-auth'
    )
    .build()

    app.getHttpAdapter().getInstance().disable('x-powered-by');
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
