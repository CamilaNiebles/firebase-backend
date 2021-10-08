import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateNewReading } from './dto/create.reading';
import { RchilliService } from './rchilli.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get('/:id')
  async getFormRecord(
    @Param('id')
    id: string,
    @Res() res: any,
  ) {
    try {
      const response = await this.rchilliService.getFormRecord(id);
      return res.status(200).send(response);
    } catch (error) {
      return res.status(error.status).send(error.message);
    }
  }
  @Patch('/:id')
  async updateRecord(
    @Param('id')
    id: string,
    @Body() dataToUpdate: any,
    @Res() res: any,
  ) {
    try {
      const response = await this.rchilliService.updateRecord(id, dataToUpdate);
      return res.status(200).send(response);
    } catch (error) {
      return res.status(error.status).send(error.message);
    }
  }

  @Post('/query')
  async getWithFIlters(@Body() params: any, @Res() res: any) {
    const {
      req: {
        user: { hd },
      },
    } = res;
    const domain = hd.split('.')[0];
    try {
      const response = await this.rchilliService.getRecordsWithFilter(
        params,
        domain,
      );
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      return res.status(error.status).send(error.message);
    }
  }

  @Post('/upload/:bucketName')
  @UseInterceptors(FileInterceptor('zip'))
  async uploadCurriculums(
    @Param('bucketName')
    bucketName: string,
    @UploadedFile() zip: Express.Multer.File,
    @Res() res: any,
  ) {
    try {
      const {
        req: {
          user: { hd },
        },
      } = res;
      const domain = hd.split('.')[0];
      const response = await this.rchilliService.createRecordsByZip({
        bucketName,
        zip,
        company: domain,
      });
      return res.status(HttpStatus.CREATED).send(response);
    } catch (error) {
      return res.status(error.status).send(error.message);
    }
  }

  @Post('/parse')
  async getRecordFromRchilli(@Body() body: any, @Res() res: any) {
    try {
      const response = await this.rchilliService.getRecordFromRchilli(
        body.publicUrl,
      );
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      return res.status(error.status).send(error.message);
    }
  }
}
