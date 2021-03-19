import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationMiddleware } from 'src/middleware/authetication';
import { FormsController } from './forms.controller';

@Module({
  controllers: [FormsController]
})
export class FormsModule implements NestModule{
  configure(consumer:MiddlewareConsumer){
    consumer
    .apply(AuthenticationMiddleware)
    .forRoutes('forms');
  }
}
