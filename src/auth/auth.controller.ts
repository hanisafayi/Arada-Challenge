import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  Get,
  Put,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from './auth.guard';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Roles } from './roles.decorators';
import { Role } from './enums/role.enum';
import { RolesGuard } from './roles.guards';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: { email: string; password: string }) {
    const { email, password } = signInDto;
    return await this.authService.login(email, password);
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('findall')
  findAll() {
    return this.authService.findAll();
  }

  // @UseGuards(AuthGuard)
  // @Get('findUserById/:id')
  // findUserById(@Request() req, @Param('id') id: string) {
  //   return this.authService.findUserById(id);
  // }

  @UseGuards(AuthGuard)
  @Put('updateUser/:id')
  updateUser(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete('deleteUser/:id')
  deleteUser(@Request() req, @Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

  // @Roles(Role.Admin)
  // @UseGuards(RolesGuard)
  // @Delete('deleteAll')
  // deleteAll(@Request() req) {
  //   return this.authService.deleteAllUsers();
  // }

  // @Roles(Role.Admin)
  // @UseGuards(RolesGuard)
  @Post('createAdmin')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.authService.createAdmin(createUserDto);
  }
  // @UseGuards(AuthGuard)
  // @Get('my-health-records')
  // myHealthRecords(@Req() request) {
  //   return this.authService.getHealthRecordsByUserId(request)
  // }

}
