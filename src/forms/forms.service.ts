import { Injectable } from '@nestjs/common';
import { TemplateRepository } from 'src/repositories/template.repository';
import { CreateTemplate } from './dto/create.template';

@Injectable()
export class FormsService {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async createTemplate(createTemplate: CreateTemplate) {
    return this.templateRepository.createTemplate(createTemplate);
  }
}
