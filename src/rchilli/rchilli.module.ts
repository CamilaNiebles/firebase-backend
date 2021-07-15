import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RChilli, RChilliSchema } from '../models/rchilli.model';
import {
  RChilliClean,
  RChilliCleanSchema,
} from '../models/rchilli.model.clean';
import { RChilliRepository } from '../repositories/rchilli.repository';
import { RchilliController } from './rchilli.controller';
import { RchilliService } from './rchilli.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RChilli.name,
        schema: RChilliSchema,
      },
      {
        name: RChilliClean.name,
        schema: RChilliCleanSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [RchilliController],
  providers: [RchilliService, RChilliRepository],
})
export class RchilliModule {}
