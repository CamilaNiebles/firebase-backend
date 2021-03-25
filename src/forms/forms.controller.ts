import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTemplate } from './dto/create.template';
import { FormsService } from './forms.service';

@UseGuards(AuthGuard())
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
}
