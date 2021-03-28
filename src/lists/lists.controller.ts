import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
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
}
