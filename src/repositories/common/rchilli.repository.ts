import { Injectable } from '@nestjs/common';
import {
  AGGREGATE_STATIC_VARIABLES,
  PROJECT_CONVERT_DATE_TO_ISO,
  PROJECT_DATE_AS_AN_ARRAY,
  PROJECT_EXPERIENCE_IN_MILISECONDS,
  PROJECT_YEARS_EXPERIENCE,
} from 'src/utils/constant';

@Injectable()
export class RchilliUtils {
  constructor() {}

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
    return filter;
  }

  filterStructure(params, domain) {
    let filterQuery = [];
    let unwindArray = [];
    let projectToVariables = {
      ...AGGREGATE_STATIC_VARIABLES,
      currentJobProfile: '$JobProfile',
    };
    let projectToLevel = {
      ...AGGREGATE_STATIC_VARIABLES,
      currentJobProfile: 1,
    };
    let lastMatch = [];
    let buildDeepFilter = false;
    let rangeProject;

    filterQuery = this.companyFilter(domain);
    params = this.personalValidation(params);

    Object.keys(params).forEach((parentKey) => {
      if (typeof params[parentKey] !== 'object') {
        let matchObject = [];
        matchObject = this.matchObject(
          parentKey,
          params[parentKey],
          matchObject,
        );
        filterQuery.push({
          $match: {
            $and: matchObject,
          },
        });
      } else {
        projectToVariables[parentKey] = 1;
        projectToLevel[parentKey] = 1;
        unwindArray.push(parentKey);
        const { rangeProject: project, match } = this.projectNested(
          parentKey,
          params[parentKey],
          projectToLevel,
          filterQuery,
        );
        rangeProject = project;
        lastMatch.push(match);
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
        rangeProject,
      );
      filterQuery.push(this.createGroup(projectToVariables, unwindArray));
    }
    return filterQuery;
  }

  personalValidation(params) {
    const newFilters = {};
    const { PersonalInformation, ...rest } = params;
    if (PersonalInformation) {
      params['PersonalInformation'].forEach((e) => {
        Object.entries(e).forEach(([key, value]) => {
          if (key === 'FullName') {
            newFilters['Name'] = [
              {
                FullName: value,
              },
            ];
          }
          if (key === 'email') {
            newFilters['email'] = value;
          }
        });
      });
    }
    return { ...rest, ...newFilters };
  }

  matchObject(key, conditionObject, acc = []) {
    const matchObject = [...acc];
    const phraseSegmented = conditionObject.split(' ');
    if (phraseSegmented.length > 1) {
      // let phrase = '';
      // phraseSegmented.forEach((e) => {
      //   phrase += new RegExp(e.slice(0, e.length - 2), 'i');
      // });
      matchObject.push({
        [key]: {
          $regex: new RegExp(conditionObject, 'i'),
        },
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

  projectNested(parentKey, object, accProject, filterQuery) {
    let match = [];
    let rangeProject = [];
    object.forEach((e) => {
      const { range, ...rest } = e;
      Object.keys(rest).forEach((filterKey) => {
        accProject[filterKey] = `$${parentKey}.${filterKey}`;
        Object.values(rest).forEach((conditions) => {
          if (typeof conditions === 'object') {
            for (const [key, value] of Object.entries(conditions)) {
              const response = this.matchObject(
                `${filterKey}.${key}`,
                value,
                match,
              );
              match.push(...response);
            }
          } else {
            const response = this.matchObject(
              `${filterKey}`,
              conditions,
              match,
            );
            match.push(...response);
          }
        });
      });
      rangeProject = range && this.buildRangeLogic(range);
    });
    return { match, rangeProject };
  }

  buildRangeLogic(range) {
    const { gt, lt } = range;
    const filter = [];
    const accProject = {
      ...AGGREGATE_STATIC_VARIABLES,
      currentJobProfile: 1,
    };
    filter.push({
      $project: {
        ...accProject,
        ...PROJECT_DATE_AS_AN_ARRAY,
      },
    });
    filter.push({
      $project: {
        ...accProject,
        ...PROJECT_CONVERT_DATE_TO_ISO,
      },
    });
    filter.push({
      $project: {
        ...accProject,
        ...PROJECT_EXPERIENCE_IN_MILISECONDS,
      },
    });
    filter.push({
      $project: {
        ...accProject,
        ...PROJECT_YEARS_EXPERIENCE,
      },
    });
    filter.push({
      $match: {
        $or: [
          {
            YearsExperience: {
              $gt: gt,
              $lt: lt,
            },
          },
        ],
      },
    });
    filter.push({
      $project: {
        ...accProject,
      },
    });
    return filter;
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

  createFinalFilter(
    filterQuery,
    unwind,
    projectToLevel,
    lastMatch,
    rangeProject,
  ) {
    this.unwindStage(unwind, filterQuery);
    filterQuery.push({
      $project: {
        ...projectToLevel,
      },
    });
    lastMatch.forEach((e) => {
      filterQuery.push({
        $match: {
          $and: e,
        },
      });
    });
    filterQuery.push(...rangeProject);
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
