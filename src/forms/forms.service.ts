import { Injectable } from '@nestjs/common';
import { FormRepository } from '../repositories/template.repository';
import { CreateForm } from './dto/create.template';
import { ListRepository } from '../repositories/list.repository';
import { CreateFormByUser } from './dto/create.form';
import { UpdateForm } from './dto/update.form';
import { uuid } from 'uuidv4';

@Injectable()
export class FormsService {
  constructor(
    private readonly formRepository: FormRepository,
    private readonly listRepository: ListRepository,
  ) {}

  async createTemplate(createTemplate: CreateForm) {
    const templateWithIds = this.addIdtoQuestions(createTemplate);
    return this.formRepository.createTemplate(templateWithIds);
  }

  async getTemplateByName(name: string) {
    const response = await this.formRepository.getTemplateByName(name);
    const finalForm = await this.filledForm(response);
    return finalForm;
  }

  async createFormByUser(createFormByUser: CreateFormByUser) {
    const { name, user } = createFormByUser;
    const response = await this.formRepository.getTemplateByName(name);
    const { unique } = response;
    if (!unique) {
      const form = await this.createNewUserForm(response, createFormByUser);
      const finalForm = await this.filledForm(form);
      return finalForm;
    }
    const userForm = await this.formRepository.getFormByUser(user, name);
    if (userForm) {
      const filledForm = await this.filledForm(userForm);
      return this.validateCurrentStep(filledForm);
    } else {
      const form = await this.createNewUserForm(response, createFormByUser);
      const filledForm = await this.filledForm(form);
      const finalForm = this.validateCurrentStep(filledForm);
      return finalForm;
    }
  }

  async updateForm(updateForm: UpdateForm) {
    const { name, user } = updateForm;
    await this.formRepository.updateForm(updateForm);
    const userForm = await this.formRepository.getFormByUser(user, name);
    const filledForm = await this.filledForm(userForm);
    return this.validateCurrentStep(filledForm);
  }

  validateCurrentStep(form) {
    const { question, totalSteps, _id } = form;
    let filledQuestions = [];
    let currentStepQuestions = [];
    let currentStep = 0;
    for (let i = 1; i <= totalSteps; i++) {
      let stepQuestions = question.filter((e) => e.step == i && e?.value);
      if (!stepQuestions.length) {
        currentStepQuestions = question.filter((e) => e.step == i);
        currentStep = i;
        break;
      }
      filledQuestions.push(stepQuestions);
    }
    return {
      question: currentStepQuestions,
      previousState: filledQuestions,
      currentStep,
      totalSteps,
      id: _id,
    };
  }

  async filledForm(response) {
    const { question } = response;
    const listsArray = await this.manageListsContent(question);
    const finalForm = this.generateFinalForm(response, question, listsArray);
    return finalForm;
  }

  validateEmptyQuestions(form) {
    const { question } = form;
    const emptyQuestions = question.filter((e) => e.value === null);
    form.question = emptyQuestions;
    return form;
  }

  async createNewUserForm(template, createFormByUser) {
    const { name, user } = createFormByUser;
    const { displayName, question, unique, totalSteps } = template;
    const form = {
      name,
      unique,
      displayName,
      createdBy: user,
      question,
      totalSteps,
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
  addIdtoQuestions(template) {
    let { question, ...newTemplate } = template;
    const newQuestions = question.map((e) => {
      e.id = uuid();
      return e;
    });
    newTemplate.question = newQuestions;
    return newTemplate;
  }
}
