import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RChilliClean extends Document {
  @Prop({ unique: true })
  email: string;
  @Prop()
  fileUrl: string;
  @Prop()
  company: string[];
  @Prop([Object])
  ResumeLanguage: object;
  @Prop()
  ParsingDate: string;
  @Prop([Object])
  ResumeCountry: object;
  @Prop([Object])
  Name: object;
  @Prop()
  DateOfBirth: string;
  @Prop()
  Gender: string;
  @Prop()
  FatherName: string;
  @Prop()
  MotherName: string;
  @Prop()
  MaritalStatus: string;
  @Prop()
  Nationality: string;
  @Prop()
  LanguageKnown: object[];
  @Prop()
  Email: object[];
  @Prop()
  PhoneNumber: object[];
  @Prop()
  WebSite: object[];
  @Prop()
  Address: object[];
  @Prop()
  Category: string;
  @Prop()
  SubCategory: string;
  @Prop([Object])
  CurrentSalary: object;
  @Prop([Object])
  ExpectedSalary: object;
  @Prop()
  Qualification: string;
  @Prop()
  SegregatedQualification: object[];
  @Prop()
  Certification: string;
  @Prop()
  SegregatedCertification: object[];
  @Prop()
  SkillBlock: string;
  @Prop()
  SkillKeywords: string;
  @Prop()
  SegregatedSkill: object[];
  @Prop()
  SegregatedExperience: object[];
  @Prop()
  CurrentEmployer: string;
  @Prop()
  JobProfile: string;
  @Prop([Object])
  WorkedPeriod: object;
  @Prop()
  GapPeriod: string;
  @Prop()
  AverageStay: string;
  @Prop()
  LongestStay: string;
  @Prop()
  Summary: string;
  @Prop()
  ExecutiveSummary: string;
  @Prop()
  ManagementSummary: string;
  @Prop()
  Coverletter: string;
  @Prop()
  Publication: string;
  @Prop()
  SegregatedPublication: object[];
  @Prop()
  CurrentLocation: object[];
  @Prop()
  PreferredLocation: object[];
  @Prop()
  Availability: string;
  @Prop()
  Hobbies: string;
  @Prop()
  Objectives: string;
  @Prop()
  Achievements: string;
  @Prop()
  DetailResume: string;
  @Prop()
  SegregatedAchievement: object[];
  @Prop()
  References: string;
  @Prop()
  CustomFields: string;
  @Prop([Object])
  EmailInfo: object;
  @Prop()
  Recommendations: object[];
  @Prop([Object])
  ApiInfo: object;
}

export const RChilliCleanSchema = SchemaFactory.createForClass(RChilliClean);
