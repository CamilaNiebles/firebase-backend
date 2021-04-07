import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { FormTemplateSchema } from '../models/template.model';
import { ListSchema } from '../models/list.model';
import { FormRepository } from '../repositories/template.repository';
import { ListRepository } from '../repositories/list.repository';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { FormSchema } from '../models/form.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FormTemplate', schema: FormTemplateSchema },
      { name: 'List', schema: ListSchema },
      { name: 'Form', schema: FormSchema },
    ]),
    AuthModule,
  ],
  providers: [FormsService, FormRepository, ListRepository],
  exports: [FormsService, FormRepository],
  controllers: [FormsController],
})
export class FormsModule {}
