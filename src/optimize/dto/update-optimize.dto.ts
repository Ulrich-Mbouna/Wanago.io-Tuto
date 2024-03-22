import { PartialType } from '@nestjs/mapped-types';
import { CreateOptimizeDto } from './create-optimize.dto';

export class UpdateOptimizeDto extends PartialType(CreateOptimizeDto) {}
