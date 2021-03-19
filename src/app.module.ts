import { Module } from '@nestjs/common';
import { FormsModule } from './forms/forms.module';

@Module({
  imports: [FormsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
