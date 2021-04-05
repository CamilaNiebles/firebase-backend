import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateFormByUser } from './dto/create.form';
import { CreateForm } from './dto/create.template';
import { FormsService } from './forms.service';

//@UseGuards(AuthGuard())
@Controller('forms')
export class FormsController {
  constructor(private formsService: FormsService) {}

  @Post('/template')
  async createTemplate(@Body() createTemplate: CreateForm, @Res() res: any) {
    try {
      const response = await this.formsService.createTemplate(createTemplate);
      return res.status(HttpStatus.CREATED).send(response);
    } catch (error) {
      console.log(error);
    }
  }
  @Post()
  async createFormByUser(
    @Body() createFormByUser: CreateFormByUser,
    @Res() res: any,
  ) {
    try {
      const response = await this.formsService.createFormByUser(
        createFormByUser,
      );
      return res.status(HttpStatus.CREATED).send(response);
    } catch (error) {
      // return res.status(error.status).send(error.message);
    }
  }

  @Get('/template/:name')
  async getTemplateByName(
    @Param('name')
    name: string,
    @Res() res: any,
  ) {
    try {
      const response = await this.formsService.getTemplateByName(name);
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
    }
  }
}
