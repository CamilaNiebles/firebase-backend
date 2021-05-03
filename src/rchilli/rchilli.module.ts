import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RChilli, RChilliSchema } from 'src/models/rchilli.model';
import { RChilliRepository } from 'src/repositories/rchilli.repository';
import { RchilliController } from './rchilli.controller';
import { RchilliService } from './rchilli.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RChilli.name,
        schema: RChilliSchema,
      },
    ]),
  ],
  controllers: [RchilliController],
  providers: [RchilliService, RChilliRepository],
})
export class RchilliModule {}
