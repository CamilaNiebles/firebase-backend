import { Injectable } from '@nestjs/common';
import { TaskRepository } from 'src/repositories/tasks.repository';
import { CreateTaskTemplate } from './dto/create.template';
import { uuid } from 'uuidv4';
import { CreateTask } from './dto/create';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTemplate(createTemplate: CreateTaskTemplate) {
    const templateWithIds = this.addIdtoVariables(createTemplate);
    return this.taskRepository.createTemplate(templateWithIds);
  }

  async getTemplateByName(name: string) {
    return this.taskRepository.getTemplateByName(name);
  }

  async createTaskToUser(createTask: CreateTask) {
    return this.taskRepository.createTaskToUser(createTask);
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
