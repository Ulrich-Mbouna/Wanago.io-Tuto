import { Test, TestingModule } from '@nestjs/testing';
import { OptimizeController } from './optimize.controller';
import { OptimizeService } from './optimize.service';

describe('OptimizeController', () => {
  let controller: OptimizeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptimizeController],
      providers: [OptimizeService],
    }).compile();

    controller = module.get<OptimizeController>(OptimizeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
