import { Injectable } from '@nestjs/common';

@Injectable()
export class RchilliUtils {
  constructor() {}

  experienceRange(project, range) {
    const { gt, lt } = range;
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
      email: 1,
      currentJobProfile: '$JobProfile',
    };
    let projectToLevel = {
      Name: 1,
      fileUrl: 1,
      ResumeCountry: 1,
      WorkedPeriod: 1,
      currentJobProfile: 1,
      email: 1,
    };
    let lastMatch = [];
    let buildDeepFilter = false;
    params = this.personalValidation(params);
    Object.keys(params).forEach((parentKey) => {
      if (typeof params[parentKey] !== 'object') {
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
        unwindArray.push(parentKey);
        lastMatch.push(
          this.projectNested(parentKey, params[parentKey], projectToLevel),
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
    lastMatch.forEach((e) => {
      filterQuery.push({
        $match: {
          $and: e,
        },
      });
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
