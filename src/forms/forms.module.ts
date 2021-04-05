import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { FormTemplateSchema } from 'src/models/template.model';
import { ListSchema } from 'src/models/list.model';
import { FormRepository } from 'src/repositories/template.repository';
import { ListRepository } from 'src/repositories/list.repository';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { ListsModule } from '../lists/lists.module';
import { FormSchema } from '../models/form.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FormTemplate', schema: FormTemplateSchema },
      { name: 'List', schema: ListSchema },
      { name: 'Form', schema: FormSchema },
    ]),
    AuthModule,
    ListsModule,
  ],
  providers: [FormsService, FormRepository, ListRepository],
  exports: [FormsService, FormRepository],
  controllers: [FormsController],
})
export class FormsModule {}
