import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RChilli } from '../models/rchilli.model';
import { RChilliClean } from '../models/rchilli.model.clean';
import { CreateNewReading } from '../rchilli/dto/create.reading';
import {
  ERROR_CREATING_RECORD_RCHILLI,
  ERROR_FILTER_RECORD,
} from '../utils/constant';

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
        ERROR_CREATING_RECORD_RCHILLI,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async filterRecords(params: any) {
    const pipeline = this.filterStructure(params);
    try {
      const records = await this.rchilliCleanModel.aggregate(pipeline).exec();
      return records;
    } catch (error) {
      console.log(error);
      throw new HttpException(ERROR_FILTER_RECORD, HttpStatus.BAD_REQUEST);
    }
  }

  filterStructure(params) {
    const filterQuery = [];
    let matchObject,
      unwind = [];
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
        unwind.push(parentKey);
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
      this.createFinalFilter(filterQuery, unwind, projectToLevel, lastMatch);
      filterQuery.push(this.createGroup(projectToVariables, unwind));
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
}
