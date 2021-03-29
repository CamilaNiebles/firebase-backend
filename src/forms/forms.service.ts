import { Injectable } from '@nestjs/common';
import { TemplateRepository } from 'src/repositories/template.repository';
import { CreateTemplate } from './dto/create.template';
import { ListRepository } from 'src/repositories/list.repository';


@Injectable()
export class FormsService {
  constructor(private readonly templateRepository: TemplateRepository,
    private readonly listRepository: ListRepository)  {}

  async createTemplate(createTemplate: CreateTemplate) {
    return this.templateRepository.createTemplate(createTemplate);
  }

  async getTemplateByName(name: string){
    const response = await this.templateRepository.getTemplateByName(name)
    const { question } = response
    const includesList = question.filter( (question) => question['type'].includes('list') )
    const lists = [...new Set(includesList.map((question) => question['resource']))]

    const listsArray = await Promise.all( lists.map( (list) => {
      return this.listRepository.getListByName(list)
    }))

    const finalForm = question.map( (question) => {
      const listItems = listsArray.filter( (list) => list['name'] === question['resource'])
      question['options'] = listItems.length > 0 ? listItems[0]['options'] : null
      return question
      }
    )

  return finalForm 

  }
}
