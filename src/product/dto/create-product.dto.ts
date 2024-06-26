import { ProductInt } from "../interfaces/product.interface"
import { IsString, IsInt } from 'class-validator';

export class CreateProductDto implements Pick<ProductInt, "name" | "price" | "rating" | "image"> {
  @IsString()
  name: string;

  @IsString()
  price: string;

  @IsInt()
  rating: number;

  image: string;
}
