import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RChilli } from '../models/rchilli.model';
import { RChilliClean } from '../models/rchilli.clean.model';
import { CreateNewReading } from '../rchilli/dto/create.reading';
import * as constant from '../utils/constant';

export class RChilliRepository {
  constructor(
    @InjectModel(RChilli.name)
    private readonly rchilliModel: Model<RChilli>,
    @InjectModel(RChilliClean.name)
    private readonly rchilliCleanModel: Model<RChilliClean>,
  ) {}

  async createNewReading(newReading: CreateNewReading) {
    const {
      resumeParserData: { Email },
    } = newReading;
    const { EmailAddress: email } = Email[0];
    const newRecord = new this.rchilliModel({ email, ...newReading });
    try {
      return await newRecord.save();
    } catch (error) {
      throw new HttpException(
        constant.ERROR_CREATING_RECORD_RCHILLI,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createNewReadingV2(newReading: any) {
    try {
      const newRecord = new this.rchilliCleanModel(newReading);
      const response = await newRecord.save();
      return response;
    } catch (error) {
      throw new HttpException(
        constant.ERROR_CREATING_RECORD_RCHILLI,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllTemplates(limit, initialId = '000000000000000000000000') {
    try {
      const response = await this.rchilliModel
        .find({
          _id: { $gt: initialId },
        })
        .limit(parseInt(limit));
      return response;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Templates ${constant.ERROR_ELEMENT_NOT_FOUND}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
