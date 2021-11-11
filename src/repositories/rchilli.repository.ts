import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RChilli } from '../models/rchilli.model';
import { ERROR_FILTER_RECORD } from '../utils/constant';
import { RChilliClean } from '../models/rchilli.clean.model';
import { CreateNewReading } from '../rchilli/dto/create.reading';
import * as constant from '../utils/constant';
import { RchilliUtils } from './common/rchilli.repository';

export class RChilliRepository {
  constructor(
    @InjectModel(RChilli.name)
    private readonly rchilliModel: Model<RChilli>,
    @InjectModel(RChilliClean.name)
    private readonly rchilliCleanModel: Model<RChilliClean>,
    private readonly rchilliUtils: RchilliUtils,
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

  async updateRecord(_id: string, data: any) {
    const variables = this.getVariablesToUpdate(data);
    const query = this.queryUpdate(variables);
    try {
      await this.rchilliCleanModel.updateOne({ _id }, query).lean();
    } catch (error) {
      console.log(error);
    }
  }

  async filterRecords(params: any, domain: object) {
    const pipeline = this.rchilliUtils.filterStructure(params, domain);
    try {
      const records = await this.rchilliCleanModel.aggregate(pipeline).exec();
      return records;
    } catch (error) {
      console.log(error);
      throw new HttpException(ERROR_FILTER_RECORD, HttpStatus.BAD_REQUEST);
    }
  }

  async getById(id: string) {
    try {
      const response = await this.rchilliCleanModel.findById(id).lean();
      return response;
    } catch (error) {
      throw new HttpException(
        `Template ${constant.ERROR_ELEMENT_NOT_FOUND}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  getVariablesToUpdate(data) {
    const newVariables = [];
    data.forEach((section) => {
      const { variables: variablesParent } = section;
      variablesParent.forEach((arrayVariables) => {
        const { variables } = arrayVariables;
        variables.forEach((e) => {
          Object.entries(e).forEach(([key, value]) => {
            const object = {};
            object[key] = value;
            newVariables.push(object);
          });
        });
      });
    });
    return newVariables;
  }

  queryUpdate(params) {
    const objectUpdate = {};
    params.forEach((e) => {
      Object.entries(e).forEach(([key, value]) => {
        const [parentKey, index] = key.split('_');
        if (Array.isArray(value)) {
          value.forEach((element) => {
            objectUpdate[`${parentKey}.${index}.${element['rchilliKey']}`] =
              element['value'];
          });
        }
      });
    });
    return { $set: objectUpdate };
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

  async getAllRecords(limit, initialId = '000000000000000000000000') {
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
