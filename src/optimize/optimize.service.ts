import { Injectable } from '@nestjs/common';
import { CreateOptimizeDto } from './dto/create-optimize.dto';
import { UpdateOptimizeDto } from './dto/update-optimize.dto';

@Injectable()
export class OptimizeService {
  create(createOptimizeDto: CreateOptimizeDto) {
    return 'This action adds a new optimize';
  }

  findAll() {
    return `This action returns all optimize`;
  }

  findOne(id: number) {
    return `This action returns a #${id} optimize`;
  }

  update(id: number, updateOptimizeDto: UpdateOptimizeDto) {
    return `This action updates a #${id} optimize`;
  }

  remove(id: number) {
    return `This action removes a #${id} optimize`;
  }
}
