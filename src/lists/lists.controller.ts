import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CreateList } from './dto/create.list';
import { ListsService } from './lists.service';

@Controller('lists')
export class ListsController {
  constructor(private listService: ListsService) {}

  @Post()
  async createList(@Body() createList: CreateList, @Res() res: any) {
    const response = await this.listService.createList(createList);
    return res.status(HttpStatus.CREATED).send(response);
  }

  @Get('/:name')
  async getListByName(@Param('name') name: string, @Res() res: any) {
    const response = await this.listService.getListByName(name);
    return res.status(HttpStatus.OK).send(response);
  }
}
