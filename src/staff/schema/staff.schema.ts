import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type StaffDocument = HydratedDocument<Staff>

@Schema()
export class Staff {

    @Prop({
        default: null
    })
    staffID: string

    @Prop({ required: true })
    fName: string;

    @Prop({ required: true })
    lName: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    jobTitle: string;

    @Prop({ required: true })
    yearJoined: number;

    @Prop({ required: true })
    role: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, unique: true })
    phone: string

    @Prop({ required: true })
    isActive: boolean
}

export const StaffSchema = SchemaFactory.createForClass(Staff)

StaffSchema.pre('save', function (next) {
    this.fullName = [this.fName.toLowerCase(), this.lName.toLowerCase()].sort().join('')
    next()
})
