import { Test, TestingModule } from '@nestjs/testing';
import { OptimizeService } from './optimize.service';

describe('OptimizeService', () => {
  let service: OptimizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OptimizeService],
    }).compile();

    service = module.get<OptimizeService>(OptimizeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
