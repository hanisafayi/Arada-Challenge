import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { SalonsController } from './salons.controller';
import {SalonsService } from './salons.service';
import { SalonSchema } from './schema/salon.schema';
@Module({
    imports:[MongooseModule.forFeature([{name:'Salon',schema:SalonSchema}])],
    controllers:[SalonsController],
    providers:[SalonsService]
})
export class SalonsModule {}
