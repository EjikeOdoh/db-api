import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CreateStudentDto } from "../dto/create-student.dto";

export type StudentDocument = HydratedDocument<CreateStudentDto>

@Schema()
export class Student {
    @Prop({ required: true })
    fName: string;

    @Prop({ required: true })
    lName: string;

    @Prop({ required: true })
    dob: Date;

    @Prop({ required: true })
    program: string;

    @Prop({ required: true })
    year: Date;
}

export const StudentSchema = SchemaFactory.createForClass(CreateStudentDto)