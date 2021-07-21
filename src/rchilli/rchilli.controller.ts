import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
<<<<<<< HEAD
  UseGuards,
=======
  Query,
>>>>>>> feature/solr_integration
} from '@nestjs/common';
import { CreateNewReading } from './dto/create.reading';
import { RchilliService } from './rchilli.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard())
@Controller('rchilli')
export class RchilliController {
  constructor(private rchilliService: RchilliService) {}

  @Post()
  async createNewRecord(@Body() createNew: CreateNewReading, @Res() res: any) {
    try {
      const response = await this.rchilliService.createRecord(createNew);
      return res.status(HttpStatus.CREATED).send(response);
    } catch (error) {
      return res.status(error.status).send(error.message);
    }
  }

<<<<<<< HEAD
  @Post('/query')
  async getWithFIlters(@Body() params: any, @Res() res: any) {
    try {
      const response = await this.rchilliService.getRecordsWithFilter(params);
=======
  @Get('/test')
  async getTest(@Res() res: any) {
    try {
      const response = await this.rchilliService.createCVSolr();
>>>>>>> feature/solr_integration
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      return res.status(error.status).send(error.message);
    }
  }
}
