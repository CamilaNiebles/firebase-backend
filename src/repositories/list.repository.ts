import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateList } from 'src/lists/dto/create.list';
import { List } from 'src/models/list.model';
import * as constant from '../utils/constant';
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
        constant.ERROR_CREATING_LIST,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getListByName(name: string) {
    try {
      return this.listModel.findOne({ name });
    } catch (error) {
      throw new HttpException(
        constant.ERROR_LIST_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
