import { Injectable } from '@nestjs/common';
import {Salon} from './interfaces/salon.interface'
import {Model} from 'mongoose'
import {InjectModel} from '@nestjs/mongoose'
import { CreateSalonDto } from './dto/create-salon.dto';
import { getSalonFilterDto } from './dto/filter-salon.dto';

@Injectable()
export class SalonsService {
    constructor(@InjectModel('Salon') private readonly salonModel:Model<Salon>){}
   
    async getSalona(filterDto:getSalonFilterDto):Promise<Salon[]>{
        let options={}
        const {salons}=filterDto
        console.log(salons)
        if (salons){
            options={
                salons:salons
            }
        }
        return await this.salonModel.find(options);
    }

    async getOne(id:string):Promise<Salon>{
        return await this.salonModel.findOne({_id:id});
    }

    async create(salon:CreateSalonDto,path:string):Promise<Salon>{
        const newSalon=new this.salonModel(salon);
        console.log(newSalon)
        newSalon.picturePath=path 
        return await newSalon.save()
    }

    async delete(id:string):Promise<Salon>{
        return await this.salonModel.findByIdAndDelete(id);
    }

    async update (id:string,salon:Salon):Promise<Salon>{
        return await this.salonModel.findByIdAndUpdate(id,salon,{new:true})
    }
    async deleteAll():Promise<any>{
        return await this.salonModel.deleteMany({})

    }


}
