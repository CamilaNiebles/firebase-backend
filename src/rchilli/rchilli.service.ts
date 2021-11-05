import { Injectable } from '@nestjs/common';
import { RChilliRepository } from '../repositories/rchilli.repository';
import { Utils } from './common/utils';
import { CreateNewReading } from './dto/create.reading';
import { UploadZip } from './dto/upload.zip';
import _ from 'lodash';
import { RCHILLISTRUCTURE } from './common/rchilli.structure';
@Injectable()
export class RchilliService {
  constructor(
    private readonly rchilliRepository: RChilliRepository,
    private readonly utils: Utils,
  ) {}

  async getRecordsWithFilter(params: any, domain: object) {
    return this.rchilliRepository.filterRecords(params, domain);
  }

  async createRecord(record: CreateNewReading) {
    const newDoc = this.utils.restructureDoc(record);
    return this.rchilliRepository.createNewReadingV2(newDoc);
  }

  async updateRecord(id: string, data: any) {
    const response = this.rchilliRepository.updateRecord(id, data);
  }

  async getFormRecord(id: string) {
    const response = await this.rchilliRepository.getById(id);
    const filledForm = this.utils.buildForm(response, RCHILLISTRUCTURE);
    return filledForm;
  }

  async createRecordsByZip(data: UploadZip) {
    try {
      const saveRecords = [];
      const response = [];
      const {
        successedValues,
        failedValues,
      } = await this.utils.createFilesAndProcessRecord(data);
      successedValues.forEach((e: CreateNewReading) => {
        saveRecords.push(this.createRecord(e));
      });
      const recordsSaved = await (Promise as any).allSettled(saveRecords);
      recordsSaved.forEach((e) => {
        const {
          status,
          value: { fileUrl, email },
        } = e;
        response.push({ status, fileUrl, email });
      });
      return {
        response,
        failedValues: failedValues ?? {},
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getRecordFromRchilli(publicUrl: string) {
    return this.utils.getRecordFromRchilli(publicUrl);
  }

  async getByCompany(company: string, initialId: string) {
    return this.rchilliRepository.getByCompany(company, initialId);
  }
}
