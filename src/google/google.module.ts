import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleStorage } from './storage/storage.service';

@Module({
  controllers: [GoogleController],
  providers: [GoogleStorage],
})
export class GoogleModule {}
