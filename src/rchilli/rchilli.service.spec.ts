import { Test, TestingModule } from '@nestjs/testing';
import { RchilliService } from './rchilli.service';

describe('RchilliService', () => {
  let service: RchilliService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RchilliService],
    }).compile();

    service = module.get<RchilliService>(RchilliService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
