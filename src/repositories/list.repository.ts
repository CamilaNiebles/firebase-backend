import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateList } from 'src/lists/dto/create.list';
import { List } from 'src/models/list.model';

export class ListRepository {
  constructor(
    @InjectModel(List.name)
    private readonly listModel: Model<List>,
  ) {}

  async createList(createList: CreateList) {
    const newList = new this.listModel(createList);
    try {
      return newList.save();
    } catch (error) {
      throw new HttpException(
        'Template could not be created',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
