import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Role } from 'src/auth/enums/role.enum';
import { jwtConstants } from '../auth/constants';
import { Model } from 'mongoose';
import { Request } from 'express';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, confirm_password, ...rest } = createUserDto;

    if (password !== confirm_password) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new this.userModel({
        email,
        password: hashedPassword,
        ...rest,
      });

      const userr = await user.save();
      const token = this.jwtService.sign({
        user: userr
      });

      return { token };
    } catch (error) {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(userId: string) {
    // Perform any necessary logout actions here
    // This could include invalidating the user's authentication token or session

    // For example, you could update the user's record in the database
    // to invalidate their authentication token or session

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { token: null } }, // Assuming you have a 'token' field in the user schema
      { new: true }
    );

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Return a success message or any additional data if needed
    return {
      message: 'Logout successful',
      user: user,
    };
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(email: string) {
    return this.userModel.findOne({ email });
  }
  findUserById(id){
    return this.userModel.findById(id)
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    try {
      const user = new this.userModel({
        email,
        password,
        roles: [Role.Admin]
      });

      // Validation code here if needed

      return user.save();
    } catch (error) {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async assignPoints(userId: string, points: number): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.points += points;
    return user.save();
  }

  async getLeaderboard(): Promise<User[]> {
    return this.userModel.find().sort({ points: -1 }).exec();
  }
  async fillProfile(userId, profileData: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndUpdate(userId, profileData, {
        new: true,
      });
  
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
  
      return user;
    } catch (error) {
      throw new HttpException(
        'Failed to update user profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
 
  async extractUserIdFromRequest(request: Request): Promise<string> {
    if (!request) {
      throw new Error('Invalid request ');
    } else if (request && !request.headers) {
      ('or headers missing');
    }
    const authorizationHeader = request.headers['authorization'];
  
    if (!authorizationHeader) {
      throw new HttpException(
        'Authorization header not found',
        HttpStatus.UNAUTHORIZED,
      );
    }
  
    const [bearer, token] = authorizationHeader.split(' ');
  
    if (bearer !== 'Bearer' || !token) {
      throw new HttpException(
        'Invalid authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const decodedToken: any = jwt.verify(token, jwtConstants.secret);
      return decodedToken.user;
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }}}