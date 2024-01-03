import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PRODUCTS_REPOSITORY } from './constants';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private productsRepository: typeof Product
  ) {}
  create(product: CreateProductDto): Promise<Product> {
    return this.productsRepository.create<Product>(product);
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.findAll<Product>();
  }

  findOne(id: number) {
    return this.productsRepository.findOne<Product>({ where: { id }});
  }

  update(id: number, updateProductDto: UpdateProductDto): Promise<Product | Error> {
    return this.productsRepository.findOne<Product>({ where: { id }}).then((item) => {
      if (item)
        item.update(updateProductDto)
      return new Error("User not found")
    })
  }

  remove(id: number) {
    return this.productsRepository.destroy({ where: { id }});
  }
}
