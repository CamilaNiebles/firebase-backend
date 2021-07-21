import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';
import { Email } from './email';

export class RchilliResponse {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  ResumeFileName: string;

  @IsNotEmpty()
  ResumeLanguage: object;

  @IsNotEmpty()
  @IsDate()
  ParsingDate: Date;

  @IsNotEmpty()
  ResumeCountry: object;

  @IsNotEmpty()
  Name: object;

  @IsDate()
  DateOfBirth: Date;

  @IsString()
  Gender: string;

  @IsString()
  MaritalStatus: string;

  @IsString()
  Nationality: string;

  @IsArray()
  LanguageKnown: object[];

  @IsArray()
  Email: Email[];

  @IsArray()
  PhoneNumber: object[];

  @IsArray()
  WebSite: object[];

  @IsArray()
  Address: object[];

  @IsNotEmpty()
  CurrentSalary: object;

  @IsNotEmpty()
  ExpectedSalary: object;

  @IsString()
  Qualification: string;

  @IsArray()
  SegregatedQualification: object[];

  @IsString()
  Certification: string;

  @IsArray()
  SegregatedCertification: object[];

  @IsString()
  SkillBlock: string;

  @IsString()
  SkillKeywords: string;

  @IsArray()
  SegregatedSkill: object[];

  @IsString()
  Experience: string;

  @IsArray()
  SegregatedExperience: object[];

  @IsString()
  CurrentEmployer: string;

  @IsString()
  JobProfile: string;

  @IsNotEmpty()
  WorkedPeriod: object;

  @IsString()
  GapPeriod: string;

  @IsString()
  AverageStay: string;

  @IsString()
  LongestStay: string;

  @IsString()
  Summary: string;

  @IsString()
  ExecutiveSummary: string;

  @IsString()
  ManagementSummary: string;

  @IsString()
  Coverletter: string;

  @IsString()
  Publication: string;

  @IsArray()
  SegregatedPublication: object[];

  @IsArray()
  CurrentLocation: object[];

  @IsArray()
  PreferredLocation: object[];

  @IsString()
  Availability: string;

  @IsString()
  Hobbies: string;

  @IsString()
  Objectives: string;

  @IsString()
  Achievements: string;

  @IsArray()
  SegregatedAchievement: object[];

  @IsString()
  References: string;

  @IsString()
  CustomFields: string;

  @IsNotEmpty()
  EmailInfo: object;

  @IsArray()
  Recommendations: object[];

  @IsString()
  DetailResume: string;

  @IsString()
  HtmlResume: string;

  @IsObject()
  CandidateImage: object;

  @IsObject()
  TemplateOutput: object;

  @IsObject()
  ApiInfo: object;
}
