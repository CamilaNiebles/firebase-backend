export const ERROR_CREATING_LIST = 'List could not be created';
export const ERROR_CREATING_TASK = 'Task could not be created';
export const ERROR_LIST_NOT_FOUND = 'List not found';
export const ERROR_ELEMENT_NOT_FOUND = 'could not be found it';
export const ERROR_ELEMENT_NOT_CREATED = 'could not be create it';
export const ERROR_CREATING_RECORD_RCHILLI =
  'RChilli record couldnt be created';
export const ERROR_FILTER_RECORD = 'The records couldnt be get them';
export const FILE_UPLOAD_SUCCESSFULLY = 'Uploaded the file successfully:';
export const AGGREGATE_STATIC_VARIABLES = {
  Name: 1,
  fileUrl: 1,
  ResumeCountry: 1,
  WorkedPeriod: 1,
  email: 1,
};
export const PROJECT_DATE_AS_AN_ARRAY = {
  StartDateArray: {
    $split: [
      {
        $toString: '$StartDate',
      },
      '/',
    ],
  },
  EndDateArray: {
    $split: [
      {
        $toString: '$EndDate',
      },
      '/',
    ],
  },
};

export const PROJECT_CONVERT_DATE_TO_ISO = {
  StartDateArray: 1,
  EndDateArray: 1,
  StartDate: {
    $toDate: {
      $concat: [
        { $arrayElemAt: ['$StartDateArray', 2] },
        '-',
        { $arrayElemAt: ['$StartDateArray', 1] },
        '-',
        { $arrayElemAt: ['$StartDateArray', 0] },
      ],
    },
  },
  EndDate: {
    $toDate: {
      $concat: [
        { $arrayElemAt: ['$EndDateArray', 2] },
        '-',
        { $arrayElemAt: ['$EndDateArray', 1] },
        '-',
        { $arrayElemAt: ['$EndDateArray', 0] },
      ],
    },
  },
};

export const PROJECT_EXPERIENCE_IN_MILISECONDS = {
  StartDate: 1,
  EndDate: 1,
  ExperienceRange: { $subtract: ['$EndDate', '$StartDate'] },
};

export const PROJECT_YEARS_EXPERIENCE = {
  StartDate: 1,
  EndDate: 1,
  ExperienceRange: 1,
  YearsExperience: { $divide: ['$ExperienceRange', 31104000000] },
};
