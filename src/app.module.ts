import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

config()

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage()
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [
        Product,
      ],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
