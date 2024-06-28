import { ProductInt } from "../interfaces/product.interface";

export class AllProductDto {
  page?: string
  perPage?: string
}

export class AllProductRes {
  items: ProductInt[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}