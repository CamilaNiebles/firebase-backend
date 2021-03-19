import { Controller, Get } from '@nestjs/common';

@Controller('forms')
export class FormsController {
    @Get()
    getAll(){
        console.log('We can be happy')
    }
}
