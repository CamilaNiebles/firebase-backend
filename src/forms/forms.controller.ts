import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Param
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTemplate } from './dto/create.template';
import { FormsService } from './forms.service';

//@UseGuards(AuthGuard())
@Controller('forms')
export class FormsController {
  constructor(private formsService: FormsService) {}

  @Post('/template')
  async createTemplate(
    @Body() createTemplate: CreateTemplate,
    @Res() res: any,
  ) {
    try {
      const response = await this.formsService.createTemplate(createTemplate);
      return res.status(HttpStatus.CREATED).send(response);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/template/:name')
  async getTemplateByName(@Param('name')
  name: string,
  @Res() res: any
  ){
    const response = await this.formsService.getTemplateByName(name)
    return res.status(200).send(response)
  }
}
