import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
//import { CreateUserDto } from '../users/dto/createUserDto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { User } from 'src/users/schemas/users.schema';
// import { getChallengesFilterDto } from '../challenges/dto/filter-challenge.dto';
import { Role } from './enums/role.enum';
import { Roles } from './roles.decorators';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const userr = await this.usersService.findOne(email);
    if (!userr) {
      throw new UnauthorizedException('Invalid email');
    } else if (!(await bcrypt.compare(password, userr.password))) {
      throw new UnauthorizedException('Wrong password');
    }
    const token = this.jwtService.sign({
      user: userr
    });
    return { token };
  }

  async deleteUser(id: string): Promise<void> {
    await this.usersService.deleteUser(id);
  }

  // async deleteAllUsers(): Promise<void> {
  //   await this.usersService.deleteAll();
  // }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  // async getHealthRecordsByUserId(request: Request): Promise<HealthRecord[]> {
  //   return this.usersService.getRecordsByUserId(request);
  // }
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  async findAll() {
    return this.usersService.findAll();
  }

  async createAdmin(createUserDto: CreateUserDto): Promise<{ token: string }> {
    const { email, password, confirm_password } = createUserDto;

    const existingUser = await this.usersService.findOne(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    if (!this.isValidPassword(password)) {
      throw new BadRequestException('Invalid password');
    }
    if (password !== confirm_password) {
      throw new BadRequestException(`passwords do not match`);
    
}
    const hashedPassword = await bcrypt.hash(password, 10);
    const userr = await this.usersService.createAdmin({
      ...createUserDto,
      password: hashedPassword,
      roles: [Role.Admin]
    });
    const token = this.jwtService.sign({
      user: userr
    });
    return { token };
  }
}
