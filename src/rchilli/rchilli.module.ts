import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RChilli, RChilliSchema } from '../models/rchilli.model';
import {
  RChilliCompany,
  RChilliCompanySchema,
} from '../models/rchilli.clean.model';
import { RChilliRepository } from '../repositories/rchilli.repository';
import { RchilliController } from './rchilli.controller';
import { RchilliService } from './rchilli.service';
import { Utils } from './common/utils';
import { AuthModule } from '../auth/auth.module';
import { GoogleStorage } from 'src/google/storage/storage.service';
import { RchilliUtils } from 'src/repositories/common/rchilli.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RChilli.name,
        schema: RChilliSchema,
      },
      {
        name: RChilliCompany.name,
        schema: RChilliCompanySchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [RchilliController],
  providers: [
    RchilliService,
    RChilliRepository,
    Utils,
    GoogleStorage,
    RchilliUtils,
  ],
})
export class RchilliModule {}
