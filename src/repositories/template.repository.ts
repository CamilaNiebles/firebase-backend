import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateForm } from '../forms/dto/create.template';
import { Form } from '../models/form.model';
import { FormTemplate } from '../models/template.model';

export class FormRepository {
  constructor(
    @InjectModel(FormTemplate.name)
    private readonly templateModel: Model<FormTemplate>,
    @InjectModel(Form.name)
    private readonly formModel: Model<Form>,
  ) {}

  async createTemplate(createTemplate: CreateForm) {
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

  async getTemplateByName(templateName: string) {
    return this.templateModel.findOne({ name: templateName });
  }

  async createFormByUser(createForm: CreateForm) {
    const newForm = new this.formModel(createForm);
    try {
      return await newForm.save();
    } catch (error) {
      throw new HttpException(
        'Form could not be created',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
