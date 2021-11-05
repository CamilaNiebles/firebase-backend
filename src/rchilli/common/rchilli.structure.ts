export const RCHILLISTRUCTURE = [
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
        type: 'string',
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
            type: 'string',
          },
          {
            rchilliKey: 'TotalExperienceInYear',
            displayName: 'Experiencia total en años',
            type: 'string',
          },
          {
            rchilliKey: 'TotalExperienceRange',
            displayName: 'Rango',
            type: 'string',
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
            type: 'string',
          },
          {
            rchilliKey: 'JobProfile.Title',
            displayName: 'Cargo',
            type: 'string',
          },
          {
            rchilliKey: 'Location.City',
            displayName: 'Ciudad',
            type: 'string',
          },
          {
            rchilliKey: 'JobPeriod',
            displayName: 'Periodo trabajado',
            type: 'string',
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
            type: 'string',
          },
          {
            rchilliKey: 'Degree.DegreeName',
            displayName: 'Título',
            type: 'string',
          },
          {
            rchilliKey: 'Institution.Location.City',
            displayName: 'Ciudad',
            type: 'string',
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
