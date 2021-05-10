import { Injectable } from '@nestjs/common';
import { TaskRepository } from 'src/repositories/tasks.repository';
import { CreateTaskTemplate } from './dto/create.template';
import { uuid } from 'uuidv4';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTemplate(createTemplate: CreateTaskTemplate) {
    const templateWithIds = this.addIdtoVariables(createTemplate);
    return this.taskRepository.createTemplate(createTemplate);
  }

  addIdtoVariables(template) {
    let { variables, ...newTemplate } = template;
    const newVariables = variables.map((e) => {
      e.id = uuid();
      return e;
    });
    newTemplate.variables = newVariables;
    return newTemplate;
  }
}
