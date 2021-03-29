import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTemplate } from 'src/forms/dto/create.template';
import { FormTemplate } from 'src/models/template.model';

export class TemplateRepository {
  constructor(
    @InjectModel(FormTemplate.name)
    private readonly templateModel: Model<FormTemplate>,
  ) {}

  async createTemplate(createTemplate: CreateTemplate) {
    const newTemplate = new this.templateModel(createTemplate);
    try {
      return await newTemplate.save();
    } catch (error) {
      throw new HttpException(
        'Template could not be created',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getTemplateByName(templateName: string){
    return this.templateModel.findOne({ name: templateName})
  }

}
