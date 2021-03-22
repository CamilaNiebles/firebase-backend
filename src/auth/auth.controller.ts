import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  async signUp(@Body() idToken: any, @Res() res: any) {
    const createUserDto = new CreateUserDto();
    const { sub, email, given_name, family_name } = idToken.payload;
    createUserDto.email = email;
    createUserDto.sub = sub;
    createUserDto.name = `${given_name} ${family_name}`;
    const newUser = await this.authService.signUp(createUserDto);
    return res.status(HttpStatus.OK).send(newUser);
  }
}
