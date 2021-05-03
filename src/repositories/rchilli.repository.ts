import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RChilli } from '../models/rchilli.model';
import { CreateNewReading } from '../rchilli/dto/create.reading';
import { ERROR_CREATING_RECORD_RCHILLI } from '../utils/constant';

export class RChilliRepository {
  constructor(
    @InjectModel(RChilli.name)
    private readonly rchilliModel: Model<RChilli>,
  ) {}

  async createNewReading(newReading: CreateNewReading) {
    const {
      resumeParserData: { Email },
    } = newReading;
    const { EmailAddress: email } = Email[0];
    const newRecord = new this.rchilliModel({ email, ...newReading });
    try {
      return newRecord.save();
    } catch (error) {
      throw new HttpException(
        ERROR_CREATING_RECORD_RCHILLI,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
