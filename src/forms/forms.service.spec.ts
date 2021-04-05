import { Test, TestingModule } from '@nestjs/testing';
import { FormsService } from './forms.service';
import { FormTemplateSchema } from '../models/template.model';
import dbModuleTest, {
  closeInMongoConnection,
} from '../models/testing/MongooseTestingModule';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { FormRepository } from '../repositories/template.repository';
import { FormsController } from './forms.controller';
import { ListRepository } from '../repositories/list.repository';
import { ListSchema } from '../models/list.model';
import { Connection } from 'mongoose';
import { FormSchema } from '../models/form.model';

describe('FormsService', () => {
  let service: FormsService;
  let templateRepository: FormRepository;
  let connection: Connection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormsService, FormRepository, ListRepository],
      imports: [
        dbModuleTest({
          connectionName: (new Date().getTime() * Math.random()).toString(16),
        }),
        MongooseModule.forFeature([
          { name: 'FormTemplate', schema: FormTemplateSchema },
          { name: 'List', schema: ListSchema },
          { name: 'Form', schema: FormSchema },
        ]),
      ],
      controllers: [FormsController],
    }).compile();

    service = module.get<FormsService>(FormsService);
    templateRepository = module.get<FormRepository>(FormRepository);
    connection = await module.get(getConnectionToken());
  });

  afterAll(async () => {
    await connection.close(true);
    await closeInMongoConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('Should create a template', async () => {
    const templateTest = {
      name: 'template-test',
      unique: false,
      displayName: 'Template test',
      createdDate: new Date(),
      createdBy: 'test@gmail.com',
      question: [
        {
          question: '¿En qué idioma recibes hojas de vida?',
          name: 'languages',
          resource: 'languages',
          type: 'list_multiple_option',
          value: '',
          step: '3',
          id: 'uuid-value',
          options: '',
        },
        {
          question: 'Primer nombre',
          name: 'first_name',
          resource: '',
          type: 'text_input',
          value: '',
          step: '1',
          id: 'uuid-value',
        },
      ],
    };
    const template = await service.createTemplate(templateTest);
    expect(template._id).toBeDefined();
    expect(template.name).toEqual(templateTest.name);
  });
  it('Should not create a template', async () => {
    const templateTest = {
      name: '',
      unique: false,
      displayName: 'Template test',
      createdDate: new Date(),
      createdBy: 'test@gmail.com',
      question: [],
    };
    expect(
      async () => await service.createTemplate(templateTest),
    ).rejects.toThrow();
  });
});
