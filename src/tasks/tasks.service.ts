import { Injectable } from '@nestjs/common';
import { TaskRepository } from 'src/repositories/tasks.repository';
import { CreateTaskTemplate } from './dto/create.template';
import { uuid } from 'uuidv4';
import { CreateTask } from './dto/create';
import { TasksTemplate } from 'src/models/tasks.template.model';
import { TaskByWorkspace } from './dto/get.taskWorkspace';

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

  async getAllTaskByUser(user: string) {
    const promiseArray = [];
    const allTemplates = await this.taskRepository.getAllTemplates();
    allTemplates.forEach((e) => {
      const { name } = e;
      promiseArray.push(
        this.taskRepository.getTaskByUserAndName({
          name,
          createdBy: user,
        }),
      );
    });
    const tasksUser = await Promise.all(promiseArray);
    const tasks = this.countTasksByType(allTemplates, tasksUser);
    const response = {
      usedTask: '0-100',
      plan: 'Gratis',
      tasks,
    };

    return response;
  }

  async getAllTaskUserByWorkspace(taskByWorkspace: TaskByWorkspace) {
    const promises = [
      this.taskRepository.getAllTemplates(),
      this.taskRepository.getTaskByUserAndWorkspace(taskByWorkspace),
    ];
    const promisesResponse = await Promise.all(promises);
    const response = this.generateWorkspaceResponse(
      promisesResponse[0],
      promisesResponse[1],
    );
    return response;
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

  countTasksByType(allTemplates: TasksTemplate[], taskUser) {
    const response = [];
    let template: any;
    for (template of allTemplates) {
      let tasksIds = [];
      const { name, displayName, displayUrl: iconUrl } = template;
      taskUser.forEach((e) => {
        const taskName = e[0]?.name;
        if (e.length && taskName === name) {
          tasksIds = e.map((element) => {
            return element._id;
          });
        }
      });
      response.push({
        name,
        displayName,
        iconUrl,
        total: tasksIds.length,
        tasks: tasksIds,
      });
    }
    return response;
  }

  generateWorkspaceResponse(templates, taskUser) {
    const response = [];
    taskUser.forEach((e) => {
      const { variables, _id: id } = e;
      const taskNameArray = variables.filter(
        (v) => v.variableName === 'taskName',
      );
      const template = templates.filter((t) => e.name === t.name);
      const { displayName, displayUrl: iconUrl, name } = template[0];
      const taskName = taskNameArray[0].value;
      response.push({
        id,
        displayName,
        iconUrl,
        name,
        taskName,
      });
    });
    return response;
  }
}
