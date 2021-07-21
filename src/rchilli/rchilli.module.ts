import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RChilli, RChilliSchema } from '../models/rchilli.model';
import {
  RChilliClean,
  RChilliCleanSchema,
<<<<<<< HEAD
} from '../models/rchilli.model.clean';
=======
} from '../models/rchilli.clean.model';
>>>>>>> feature/solr_integration
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
