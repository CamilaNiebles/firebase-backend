import { Injectable } from '@nestjs/common';
import { RChilliRepository } from '../repositories/rchilli.repository';
import { CreateNewReading } from './dto/create.reading';
@Injectable()
export class RchilliService {
  constructor(private readonly rchilliRepository: RChilliRepository) {}

  async getRecordsWithFilter(params: any) {
    return this.rchilliRepository.filterRecords(params);
  }

  async createRecord(record: CreateNewReading) {
    const newDoc = this.restructureDoc(record);
    return this.rchilliRepository.createNewReadingV2(newDoc);
  }

  restructureDoc(doc) {
    const { resumeParserData, fileUrl, company } = doc;
    const { Email } = resumeParserData;
    const { EmailAddress: email } = Email[0];
    const {
      ResumeFileName,
      UniqueID,
      LicenseNo,
      PassportDetail,
      PanNo,
      VisaStatus,
      FatherName,
      MotherName,
      Experience,
      DetailResume,
      TemplateOutput,
      CandidateImage,
      ...information
    } = resumeParserData;
    return {
      email,
      fileUrl,
      company,
      ...information,
    };
  }
}
