import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FormTemplateSchema } from 'src/models/template.model';
import { rootMongooseTestModule } from 'src/models/testing/MongooseTestingModule';
import { FormsController } from './forms.controller';

describe('FormsController', () => {
  let controller: FormsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormsController],
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'FormTemplate', schema: FormTemplateSchema },
        ]),
      ],
    }).compile();

    controller = module.get<FormsController>(FormsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
