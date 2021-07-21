import { Injectable } from '@nestjs/common';
import { RChilliRepository } from '../repositories/rchilli.repository';
import { CreateNewReading } from './dto/create.reading';

const ids = [
  '6097e847dc7f0449c028ccfd',
  '6098a2322446e102efa261b3',
  '609af5250e735c51f97ea94b',
  '609af9620e735c6ae47ea9af',
  '609c51c8b1141f63fbf66a0d',
  '609f0313a7abeb16d9f22a14',
];
@Injectable()
export class RchilliService {
  constructor(private readonly rchilliRepository: RChilliRepository) {}
  async createRecord(createNew: CreateNewReading) {
    return this.rchilliRepository.createNewReading(createNew);
  }
  async getRecordsWithFilter(params: any) {
    return this.rchilliRepository.filterRecords(params);
  }
  async createCVSolr() {
    const cvArray = await this.rchilliRepository.getAllTemplates(
      100,
      '609f0313a7abeb16d9f22a14',
    );
    const newDocs = this.restructureDocs(cvArray);
    try {
      const promiseArray = [];
      newDocs.forEach((e) => {
        promiseArray.push(this.rchilliRepository.createNewReadingV2(e));
      });
      // const response = await createSolrData(newDocs);
      const response = await Promise.all(promiseArray);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  restructureDocs(docs) {
    const newDocs = [];
    docs.forEach((e) => {
      const { resumeParserData, _id, email, fileUrl } = e._doc;
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
      newDocs.push({
        // id: _id.toString(),
        email,
        fileUrl,
        ...information,
      });
    });
    return newDocs;
  }
  // async getRecords() {
  //   const cvArray = [];
  //   let response;
  //   for (let i = 1; i < 72; i++) {
  //     if (i === 1) {
  //       response = await this.rchilliRepository.getAllTemplates(10);
  //     } else {
  //       response = await this.rchilliRepository.getAllTemplates(
  //         10,
  //         cvArray[cvArray.length - 1]._id,
  //       );
  //     }
  //     cvArray.push(...response);
  //   }
  //   return cvArray;
  // }
}
