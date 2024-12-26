import { IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateStudentDto {

    @IsString()
    @IsNotEmpty()
    fName: string;

    @IsString()
    @IsNotEmpty()
    lName: string;

    @IsDateString()
    @IsNotEmpty()
    dob: Date;

    @IsEnum(["ASCG" , "CBC" , "SSC" , "DSC"], {
        message:"Program Required"
    })
    program: "ASCG" | "CBC" | "SSC" | "DSC";

    @IsDateString()
    year: Date;
}


export class Program {
    program: "ASCG" | "CBC" | "SSC" | "DSC";
}