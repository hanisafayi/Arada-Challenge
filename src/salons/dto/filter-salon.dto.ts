import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { salons } from "../salons.enum";

export class getSalonFilterDto{

    @IsOptional()
    @IsIn([salons.Esat,salons.kurt])
salons:salons

  
}