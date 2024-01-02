import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { productsProviders } from './product.providers';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ...productsProviders]
})
export class ProductModule {}
