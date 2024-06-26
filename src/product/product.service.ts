import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Observable, from, of, switchMap, tap } from 'rxjs';
import { ProductInt } from './interfaces/product.interface';
import { FileService } from 'src/file/file.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly fileService: FileService,
  ) {}

  create(productBody: CreateProductDto): Observable<ProductInt> {
    return from(this.productRepository.save(productBody));
  }

  findAll(): Observable<ProductInt[]> {
    return from(this.productRepository.find());
  }

  findOne(id: string): Observable<ProductInt> {
    return from(this.productRepository.findOne({
      where: {
        id
      }
    }));
  }

  async update(id: string, body: UpdateProductDto) {
    const existProduct = await this.productRepository.findOne({
      where: { id }
    })

    if (!existProduct) throw new NotFoundException("Product not found");

    return from(this.productRepository.update(
      { id: existProduct.id },
      body
    )).pipe(
      tap(() => {
        if (!!body.image && body.image !== existProduct.image) this.fileService.remove(existProduct.image);
      })
    )
  }

  async remove(id: string): Promise<Observable<DeleteResult>> {
    const existProduct = await this.productRepository.findOne({
      where: { id }
    })

    if (!existProduct) throw new NotFoundException("Product not found")

    return this.fileService.remove(existProduct.image).pipe(
      switchMap((isRemove) => {
        if (!isRemove) throw new NotFoundException("Product image not found");
        return from(this.productRepository.delete({ id }))
      })
    )
  }
}
