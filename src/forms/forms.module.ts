import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { FormTemplateSchema } from 'src/models/template.model';
import { TemplateRepository } from 'src/repositories/template.repository';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FormTemplate', schema: FormTemplateSchema },
    ]),
    AuthModule,
  ],
  providers: [FormsService, TemplateRepository],
  exports: [FormsService, TemplateRepository],
  controllers: [FormsController],
})
export class FormsModule {}
