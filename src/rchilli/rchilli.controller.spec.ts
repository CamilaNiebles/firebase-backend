import { Test, TestingModule } from '@nestjs/testing';
import { RchilliController } from './rchilli.controller';

describe('RchilliController', () => {
  let controller: RchilliController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RchilliController],
    }).compile();

    controller = module.get<RchilliController>(RchilliController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
