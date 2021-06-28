import { Injectable } from '@nestjs/common';
import { RChilliRepository } from '../repositories/rchilli.repository';
import { CreateNewReading } from './dto/create.reading';

@Injectable()
export class RchilliService {
  constructor(private readonly rchilliRepository: RChilliRepository) {}
  async createRecord(createNew: CreateNewReading) {
    return this.rchilliRepository.createNewReading(createNew);
  }
  async getRecordsWithFilter(params: any) {
    return this.rchilliRepository.filterRecords(params);
  }
}
