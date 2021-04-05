import { Injectable } from '@nestjs/common';
import { FormRepository } from '../repositories/template.repository';
import { CreateForm } from './dto/create.template';
import { ListRepository } from '../repositories/list.repository';

@Injectable()
export class FormsService {
  constructor(
    private readonly formRepository: FormRepository,
    private readonly listRepository: ListRepository,
  ) {}

  async createTemplate(createTemplate: CreateForm) {
    return this.formRepository.createTemplate(createTemplate);
  }

  async getTemplateByName(name: string) {
    const response = await this.formRepository.getTemplateByName(name);
    const { question } = response;
    const listsArray = await this.manageListsContent(question);
    const finalForm = this.generateFinalForm(question, listsArray);

    return finalForm;
  }

  manageListsContent(question: any) {
    const includesList = question.filter((question) =>
      question['type'].includes('list'),
    );
    const lists: any = [
      ...new Set(includesList.map((question) => question['resource'])),
    ];
    const listsArray = Promise.all(
      lists.map((list) => {
        return this.listRepository.getListByName(list);
      }),
    );
    return listsArray;
  }

  generateFinalForm(question: any, listsArray: any) {
    const finalForm = question.map((question) => {
      const listItems = listsArray.filter(
        (list) => list['name'] === question['resource'],
      );
      question['options'] =
        listItems.length > 0 ? listItems[0]['options'] : null;
      return question;
    });
    return finalForm;
  }
}
