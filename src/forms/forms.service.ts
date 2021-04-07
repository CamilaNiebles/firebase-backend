import { Injectable } from '@nestjs/common';
import { FormRepository } from '../repositories/template.repository';
import { CreateForm } from './dto/create.template';
import { ListRepository } from '../repositories/list.repository';
import { CreateFormByUser } from './dto/create.form';
import { UpdateForm } from './dto/update.form';

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
    const finalForm = this.generateFinalForm(response, question, listsArray);

    return finalForm;
  }

  async createFormByUser(createFormByUser: CreateFormByUser) {
    const { name, user } = createFormByUser;
    const response = await this.getTemplateByName(name);
    const { unique } = response;
    if (!unique) {
      const form = await this.createNewUserForm(response, createFormByUser);
      return form;
    }
    const userForm = await this.formRepository.getFormByUser(user);
    if (userForm) {
      return this.validateEmptyQuestions(userForm);
    } else {
      const form = await this.createNewUserForm(response, createFormByUser);
      return form;
    }
  }

  async updateForm(updateForm: UpdateForm) {
    const response = this.formRepository.updateForm(updateForm);
    return response;
  }

  validateEmptyQuestions(form) {
    const { question } = form;
    const emptyQuestions = question.filter((e) => e.value === null);
    form.question = emptyQuestions;
    return form;
  }

  async createNewUserForm(template, createFormByUser) {
    const { name, user } = createFormByUser;
    const { displayName, question, unique } = template;
    const form = {
      name,
      unique,
      displayName,
      createdBy: user,
      question,
    };
    return this.formRepository.createFormByUser(form);
  }

  async manageListsContent(question: any) {
    const includesList = question.filter((question) =>
      question['type'].includes('list'),
    );
    const lists: any = [
      ...new Set(includesList.map((question) => question['resource'])),
    ];
    const listsArray = await Promise.all(
      lists.map((list) => {
        return this.listRepository.getListByName(list);
      }),
    );
    return listsArray;
  }

  generateFinalForm(response, question: any, listsArray: any) {
    const finalForm = question.map((question) => {
      const listItems = listsArray.filter(
        (list) => list['name'] === question['resource'],
      );
      question['options'] =
        listItems.length > 0 ? listItems[0]['options'] : null;
      return question;
    });
    response.question = finalForm;
    return response;
  }
}
