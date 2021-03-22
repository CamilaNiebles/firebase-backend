import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: any) {
    const newUser = await this.userService.createUser(createUserDto);
    return res.status(HttpStatus.CREATED).send(newUser);
  }
}
