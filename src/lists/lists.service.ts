import { Injectable } from '@nestjs/common';
import { ListRepository } from 'src/repositories/list.repository';
import { CreateList } from './dto/create.list';

@Injectable()
export class ListsService {
  constructor(private readonly listRepository: ListRepository) {}

  async createList(createList: CreateList) {
    return this.listRepository.createList(createList);
  }
}
