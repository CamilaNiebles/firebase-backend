import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { GoogleStorage } from './storage/storage.service';

@Controller('google')
export class GoogleController {
  constructor(private storageService: GoogleStorage) {}
  @Post('/storage/bucket')
  async createBucket(@Body() body: any, @Res() res: any) {
    try {
      const response = await this.storageService.createBucket(body.bucketName);
      return res.status(HttpStatus.CREATED).send(response);
    } catch (error) {
      return res.status(error.status).send(error.message);
    }
  }
}
