import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { categoriesProviders } from './category.providers';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, ...categoriesProviders]
})
export class CategoryModule {}
