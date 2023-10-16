import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryNotFoundException } from './exceptions/CategoryNotFound.exception';
import { raw } from 'express';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(createCategoryDto);

    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        posts: true,
      },
    });

    if (category) return category;
    throw new CategoryNotFoundException(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.update(id, updateCategoryDto);
    const updatedCategory = await this.findOne(id);

    if (updatedCategory) return updateCategoryDto;
    throw new CategoryNotFoundException(id);
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }
}
