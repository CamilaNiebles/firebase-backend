import { Injectable } from '@nestjs/common';
import { RChilliRepository } from '../repositories/rchilli.repository';
import { CreateNewReading } from './dto/create.reading';
import { FormValue } from './dto/formValue';
@Injectable()
export class RchilliService {
  constructor(private readonly rchilliRepository: RChilliRepository) {}

  async getRecordsWithFilter(params: any, domain: object) {
    return this.rchilliRepository.filterRecords(params, domain);
  }

  async createRecord(record: CreateNewReading) {
    const newDoc = this.restructureDoc(record);
    return this.rchilliRepository.createNewReadingV2(newDoc);
  }

  async getFormRecord(id: string) {
    const rchilliKeys = [
      {
        sectionName: 'general_information',
        displayName: 'Información general',
        variables: [
          {
            rchilliKey: 'ResumeCountry',
            displayName: 'País',
            type: 'array',
            variables: [
              { rchilliKey: 'Country', displayName: 'País', type: 'string' },
            ],
          },
          {
            rchilliKey: 'Name',
            displayName: 'Nombre',
            type: 'array',
            variables: [
              {
                rchilliKey: 'FirstName',
                displayName: 'Primer nombre',
                type: 'string',
              },
              {
                rchilliKey: 'MiddleName',
                displayName: 'Segundo nombre',
                type: 'string',
              },
              {
                rchilliKey: 'LastName',
                displayName: 'Apellidos',
                type: 'string',
              },
            ],
          },
          {
            rchilliKey: 'DateOfBirth',
            displayName: 'Cumpleaños',
            type: 'simpleObject',
          },
          {
            rchilliKey: 'Address',
            displayName: 'Ubicación',
            type: 'array',
            variables: [
              {
                rchilliKey: 'Street',
                displayName: 'Dirección',
                type: 'string',
              },
              { rchilliKey: 'Country', displayName: 'País', type: 'string' },
              { rchilliKey: 'State', displayName: 'Ciudad', type: 'string' },
            ],
          },
        ],
      },
      {
        sectionName: 'experiencie',
        displayName: 'Experiencia',
        variables: [
          {
            rchilliKey: 'WorkedPeriod',
            displayName: 'Tiempo trabajando',
            type: 'array',
            variables: [
              {
                rchilliKey: 'TotalExperienceInMonths',
                displayName: 'Experiencia total en meses',
              },
              {
                rchilliKey: 'TotalExperienceInYear',
                displayName: 'Experiencia total en años',
              },
              {
                rchilliKey: 'TotalExperienceRange',
                displayName: 'Rango',
              },
            ],
          },
          {
            rchilliKey: 'SegregatedExperience',
            displayName: 'Experiencia laboral',
            type: 'array',
            variables: [
              {
                rchilliKey: 'Employer.EmployerName',
                displayName: 'Empleador',
                type: 'object',
              },
              { rchilliKey: 'JobProfile.Title', displayName: 'Cargo' },
              {
                rchilliKey: 'Location.City',
                displayName: 'Ciudad',
                type: 'object',
              },
              { rchilliKey: 'JobPeriod', displayName: 'Periodo trabajado' },
              {
                rchilliKey: 'StartDate',
                displayName: 'Fecha de inicio',
                type: 'date',
              },
              {
                rchilliKey: 'EndDate',
                displayName: 'Fecha de finalización',
                type: 'date',
              },
              {
                rchilliKey: 'JobDescription',
                displayName: 'Resumen',
                type: 'string',
              },
            ],
          },
        ],
      },
      {
        sectionName: 'qualification',
        displayName: 'Educación y aptitudes',
        variables: [
          {
            rchilliKey: 'SegregatedSkill',
            displayName: 'Habilidades',
            type: 'array',
            variables: [
              { rchilliKey: 'Type', displayName: 'Tipo', type: 'string' },
              { rchilliKey: 'Skill', displayName: 'Habilidad', type: 'string' },
              {
                rchilliKey: 'Ontology',
                displayName: 'Ontología',
                type: 'string',
              },
            ],
          },
          {
            rchilliKey: 'SegregatedQualification',
            displayName: 'Experiencia académica',
            type: 'array',
            variables: [
              {
                rchilliKey: 'Institution.Name',
                displayName: 'Institución',
                type: 'object',
              },
              {
                rchilliKey: 'Degree.DegreeName',
                displayName: 'Título',
                type: 'object',
              },
              {
                rchilliKey: 'Institution.Location.City',
                displayName: 'Ciudad',
                type: 'object',
              },
              {
                rchilliKey: 'StartDate',
                displayName: 'Fecha de inicio',
                type: 'date',
              },
              {
                rchilliKey: 'EndDate',
                displayName: 'Fecha de finalización',
                type: 'date',
              },
            ],
          },
        ],
      },
    ];
    const response = await this.rchilliRepository.getById(id);
    const filledForm = this.buildForm(response, rchilliKeys);
    return filledForm;
  }

  restructureDoc(doc) {
    const { resumeParserData, fileUrl, company } = doc;
    const { Email } = resumeParserData;
    const { EmailAddress: email } = Email[0];
    const {
      ResumeFileName,
      UniqueID,
      LicenseNo,
      PassportDetail,
      PanNo,
      VisaStatus,
      FatherName,
      MotherName,
      Experience,
      TemplateOutput,
      CandidateImage,
      ...information
    } = resumeParserData;
    return {
      email,
      fileUrl,
      company,
      ...information,
    };
  }

  buildForm(response, rchilliForm) {
    const filledForm = [];
    rchilliForm.forEach((section) => {
      const { variables, sectionName, displayName } = section;
      const arrayVariables = [];
      variables.forEach((sectionVariables) => {
        const { variables: formVariables, type, rchilliKey } = sectionVariables;
        if (type === 'array') {
          const values = this.buildArrayValue(
            response,
            rchilliKey,
            formVariables,
          );
          arrayVariables.push({ rchilliKey, type, variables: values });
        }
      });
      filledForm.push({ sectionName, displayName, variables: arrayVariables });
    });
    return filledForm;
  }

  buildArrayValue(response, rchilliKey, variables) {
    const arrayVariables = [];
    Object.values(response[rchilliKey]).forEach((e, index) => {
      const formVariables = [];
      const object = {};
      variables.forEach((variable) => {
        const { rchilliKey: rchilliKeyValue } = variable;
        let formValue = new FormValue();
        formValue = { ...variable };
        formValue['value'] = this.concatValues(rchilliKeyValue, e);
        formVariables.push(formValue);
      });
      object[`${rchilliKey}_${index}`] = formVariables;
      arrayVariables.push(object);
    });
    return arrayVariables;
  }

  concatValues(value, object) {
    let response = null;
    const chain = value.split('.');
    if (chain.length > 1) {
      response = object;
      for (let i = 0; i < value.split('.').length; i++) {
        response = response[chain[i]];
      }
    } else {
      response = object[value];
    }
    return response;
  }
}
