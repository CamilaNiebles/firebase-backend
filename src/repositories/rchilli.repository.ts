import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RChilli } from '../models/rchilli.model';
import {
  ERROR_CREATING_RECORD_RCHILLI,
  ERROR_FILTER_RECORD,
} from '../utils/constant';
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

  async filterRecords(params: any, domain: object) {
    const pipeline = this.filterStructure(params, domain);
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

  companyFilter(domain) {
    const filter = [];
    filter.push({
      $unwind: {
        path: '$company',
      },
    });
    filter.push({
      $match: { company: domain },
    });
    // Group to agroup the company results
    // filter.push({
    //   $group: {
    //     _id: '$_id',
    //     Name: { $first: '$Name' },
    //     fileUrl: { $first: '$fileUrl' },
    //     ResumeCountry: { $first: '$ResumeCountry' },
    //     WorkedPeriod: { $first: '$WorkedPeriod' },
    //     JobProfile: { $first: '$JobProfile' },
    //     company: { $push: '$company' },
    //   },
    // });
    return filter;
  }

  filterStructure(params, domain) {
    let filterQuery = [];
    filterQuery = this.companyFilter(domain);
    let matchObject,
      unwindArray = [];
    let projectToVariables = {
      Name: 1,
      fileUrl: 1,
      ResumeCountry: 1,
      WorkedPeriod: 1,
      JobProfile: 1,
    };
    let projectToLevel = {
      Name: 1,
      fileUrl: 1,
      ResumeCountry: 1,
      WorkedPeriod: 1,
      JobProfile: 1,
    };
    let lastMatch = [];
    let buildDeepFilter = false;

    Object.keys(params).forEach((parentKey) => {
      if (typeof params[parentKey] !== 'object') {
        matchObject = this.matchObject(
          parentKey,
          params[parentKey],
          matchObject,
        );
        filterQuery.push({
          $match: {
            $or: matchObject,
          },
        });
      } else {
        projectToVariables[parentKey] = 1;
        unwindArray.push(parentKey);
        lastMatch = this.projectNested(
          parentKey,
          params[parentKey],
          projectToLevel,
        );
        buildDeepFilter = true;
      }
    });
    filterQuery.push({
      $project: {
        ...projectToVariables,
      },
    });
    if (buildDeepFilter) {
      this.createFinalFilter(
        filterQuery,
        unwindArray,
        projectToLevel,
        lastMatch,
      );
      filterQuery.push(this.createGroup(projectToVariables, unwindArray));
    }
    return filterQuery;
  }

  matchObject(key, conditionObject, acc = []) {
    const matchObject = [...acc];
    const phraseSegmented = conditionObject.split(' ');
    if (phraseSegmented.length > 1) {
      phraseSegmented.forEach((e) => {
        matchObject.push({
          [key]: {
            $regex: new RegExp(e.slice(0, e.length - 2), 'i'),
          },
        });
      });
    } else {
      matchObject.push({
        [key]: {
          $regex: new RegExp(
            conditionObject.slice(0, conditionObject.length - 2),
            'i',
          ),
        },
      });
    }
    return matchObject;
  }

  projectNested(parentKey, object, accProject) {
    let match = [];
    object.forEach((e) => {
      Object.keys(e).forEach((filterKey) => {
        accProject[filterKey] = `$${parentKey}.${filterKey}`;
        Object.values(e).forEach((conditions) => {
          for (const [key, value] of Object.entries(conditions)) {
            const response = this.matchObject(
              `${filterKey}.${key}`,
              value,
              match,
            );
            match.push(...response);
          }
        });
      });
    });
    return match;
  }

  unwindStage(unwindArray, filterQuery) {
    unwindArray.forEach((e) => {
      filterQuery.push({
        $unwind: {
          path: `$${e}`,
        },
      });
    });
  }

  createFinalFilter(filterQuery, unwind, projectToLevel, lastMatch) {
    this.unwindStage(unwind, filterQuery);
    filterQuery.push({
      $project: {
        ...projectToLevel,
      },
    });
    filterQuery.push({
      $match: {
        $and: lastMatch,
      },
    });
  }

  createGroup(projectToVariables, unwindArray) {
    const groupObject = {
      _id: '$_id',
    };
    Object.keys(projectToVariables).forEach((e) => {
      groupObject[e] = { $first: `$${e}` };
    });
    unwindArray.forEach((e) => {
      groupObject[e] = { $push: `$${e}` };
    });
    return {
      $group: {
        ...groupObject,
      },
    };
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
