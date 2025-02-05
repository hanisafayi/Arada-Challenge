import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Role } from '../../auth/enums/role.enum';
import { Salon } from 'src/salons/interfaces/salon.interface';


export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  age: number;

  @Prop()
  phoneNo: number;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ default: 100, index: true  })
  points: number;

  @Prop()
  avatar: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Salon' }] })
  challenges: Salon[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Notification' }] })
  notifications: Notification[];

  @Prop({ default: [Role.User] }) // Assign "user" role by default
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);