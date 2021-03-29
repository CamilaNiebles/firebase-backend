import { Injectable } from '@nestjs/common';
import { TemplateRepository } from 'src/repositories/template.repository';
import { CreateTemplate } from './dto/create.template';


@Injectable()
export class FormsService {
  constructor(private readonly templateRepository: TemplateRepository)  {}

  async createTemplate(createTemplate: CreateTemplate) {
    return this.templateRepository.createTemplate(createTemplate);
    // try {
    //   return this.templateRepository.createTemplate(createTemplate);
    // } catch (error) {
    //   console.log(error);
    // }
  }

  async getTemplateByName(name: string){
    const response = await this.templateRepository.getTemplateByName(name)
    const { question } = response
    const includesList = question.filter( (question) => question['type'].includes('list') )
    const lists = [...new Set(includesList.map((question) => question['resource']))]

    const ListsDB = {
      languages: {languages: ['english']},
      volume: {volume: ['1', '2', '3']},
      countries: {countries: ['Colombia', 'Ecuador']}
    }

    const fetchDatabase = (item) => {
      return new Promise((resolve) => 
      setTimeout( () => {
        resolve(ListsDB[item])
      }, 0))
    }

    const listsArray = await Promise.all( lists.map( async (list) => {
      const response = await fetchDatabase(list)
      return response
    }))

    const finalForm = question.map( (question) => {
      const listsItems = listsArray.filter((item) => item[question['resource']])
      question['resource'] = listsItems.length > 0 ? listsItems[0][question['resource']] : null
      return question
    })
  return finalForm 
  }
}
