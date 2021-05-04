import { Test, TestingModule } from '@nestjs/testing';
import dbModuleTest, {
  closeInMongoConnection,
} from '../models/testing/MongooseTestingModule';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { RChilliRepository } from '../repositories/rchilli.repository';
import { RchilliService } from './rchilli.service';
import { RChilli, RChilliSchema } from '../models/rchilli.model';
import { RchilliController } from './rchilli.controller';
import { rejects } from 'assert';
const rchilliResponse = require('../rchilli/dto/rchilli.response.mock');

let connection: Connection;
let rchilliRepository: RChilliRepository;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [RChilliRepository, RchilliService],
    imports: [
      dbModuleTest({
        connectionName: (new Date().getTime() * Math.random()).toString(16),
      }),
      MongooseModule.forFeature([
        { name: RChilli.name, schema: RChilliSchema },
      ]),
    ],
    controllers: [RchilliController],
  }).compile();

  rchilliRepository = module.get<RChilliRepository>(RChilliRepository);

  connection = await module.get(getConnectionToken());
});

afterAll(async () => {
  await connection.close(true);
  await closeInMongoConnection();
});

describe('Create new record from rchilli', () => {
  it('should be defined', () => {
    expect(rchilliRepository).toBeDefined();
  });
  it('Should create the template if data is ok', async () => {
    const newReading = {
      fileUrl:
        'https://verifikar-resumes-bucket.storage.googleapis.com/backstartup/CV%20Nataly%20Verdugo%2021.pdf',
      resumeParserData: rchilliResponse,
    };
    const { EmailAddress: emailSended } = rchilliResponse.Email[0];
    const response = await rchilliRepository.createNewReading(newReading);
    const { email } = response;
    expect(email).toEqual(emailSended);
  });
  it('Should not create the template if email exists', async () => {
    const newReading = {
      fileUrl:
        'https://verifikar-resumes-bucket.storage.googleapis.com/backstartup/CV%20Nataly%20Verdugo%2021.pdf',
      resumeParserData: rchilliResponse,
    };
    expect(async () => {
      await rchilliRepository.createNewReading(newReading);
    }).rejects.toThrow();
  });
});
