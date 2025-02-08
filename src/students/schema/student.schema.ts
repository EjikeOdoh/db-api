import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type StudentDocument = HydratedDocument<Student>

@Schema()
export class Student {
    @Prop({ required: true })
    fName: string;

    @Prop({ required: true })
    lName: string;

    @Prop({required: true})
    fullName: string;

    @Prop({
        required: true,
        set: (value) => {
          // Parse the date string in "DD-MM-YYYY" format
          const [day, month, year] = value.split("-");
          // Use Date.UTC to avoid time zone issues and ensure it's parsed correctly
          return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
        },
      })
      dob: Date;
      

    @Prop({ required: true })
    program: string;

    @Prop({ required: true })
    year: number;

    @Prop({ required: true })
    country: string;

    @Prop({
        required: true
    })
    uniqueProp: string;

    @Prop({
        required: true,
        unique: true
    })
    combined: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student)

StudentSchema.pre('save', function (next) {
    this.fullName = [this.fName, this.lName].sort().join('')
    this.uniqueProp = [this.fName, this.lName, this.dob,].sort().join('-')
    this.combined = [this.fName, this.lName, this.dob, this.program, this.year].sort().join('-')
    next()
})


StudentSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update && !Array.isArray(update)) {
        const fName = update.fName || "";
        const lName = update.lName || "";
        const dob = update.dob || "";
        const program = update.program || "";
        const year = update.year || "";
        const uniqueProp = [fName, lName, dob].sort().join('-')
        const combined = [fName, lName, dob, program, year].sort().join('-');
        this.setUpdate({ ...update, uniqueProp, combined });
    }
    next();
});
