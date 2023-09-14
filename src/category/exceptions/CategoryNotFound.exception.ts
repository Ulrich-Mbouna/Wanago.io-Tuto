import { NotFoundException } from "@nestjs/common";

export class CategoryNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Category With Id ${id} is not foud !!!`);
  }
}
