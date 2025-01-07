import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type StudentDocument = HydratedDocument<Student>

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
    year: number;

    @Prop({required: true})
    country: string;

    @Prop({
        required: true,
        unique:true
    })
    combined: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student)

StudentSchema.pre('save', function (next) {
    this.combined =  [this.fName, this.lName, this.dob,this.program, this.year].sort().join('-')
    next()
})