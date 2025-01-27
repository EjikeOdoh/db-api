import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Role } from "src/enums/role.enum.";


export class CreateStaffDto {

    @ApiProperty()
    @IsString()
    @IsOptional()
    staffID: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lName: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    jobTitle: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    yearJoined: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsEnum(Role)
    role: Role

    @ApiProperty()
    @IsBoolean()
    isActive: boolean
}
