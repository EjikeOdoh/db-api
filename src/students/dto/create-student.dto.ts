import { IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty, } from '@nestjs/swagger'
import { Program } from "src/enums/program.enum";

export class CreateStudentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lName: string;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    dob: Date;

    @ApiProperty()
    @IsEnum(Program, {
        message: "Program Required"
    })
    program: Program;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    country: string;

    @ApiProperty()
    @IsNotEmpty()
    year: number;
}


