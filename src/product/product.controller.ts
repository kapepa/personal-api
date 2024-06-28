import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, HttpStatus, HttpException, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from 'src/file/pipes/sharp.pipe';
import { FileService } from 'src/file/file.service';
import { Observable, of, switchMap } from 'rxjs';
import { ProductInt } from './interfaces/product.interface';
import { DeleteResult } from 'typeorm';
import { AllProductDto, AllProductRes } from './dto/all-product.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@UploadedFile(SharpPipe) image: string, @Body() body: CreateProductDto): Observable<ProductInt | BadRequestException> {
    try {
      const toBody = JSON.parse(JSON.stringify(body));
      return this.productService.create(Object.assign(toBody, {image}))
    } catch (err) {
      return this.fileService.remove(image).pipe(
        switchMap(() => {
          throw err
        })
      )
    }
  }

  @Get()
  findAll(@Query() query: AllProductDto): Observable<AllProductRes> {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<ProductInt> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @UploadedFile(SharpPipe) image: string, @Body() body: UpdateProductDto) {
    const toBody = JSON.parse(JSON.stringify(body));
    return this.productService.update(id, Object.assign(toBody, {image}));
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Observable<DeleteResult>> {
    return this.productService.remove(id);
  }
}
