import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DelayInterceptor } from './global/delay.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new DelayInterceptor());
  app.enableCors({
    origin: '*',
  });
  await app.listen(3000);
}
bootstrap();
