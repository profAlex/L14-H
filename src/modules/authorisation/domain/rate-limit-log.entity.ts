import {Prop, Schema} from "@nestjs/mongoose";

@Schema()
export class RateLimitLog {
    @Prop({type: String, required: true})
    deviceIp: string;

    @Prop({type: String, required: true})
    deviceName: string;

    @Prop({type: String, required: true})
    calledURL: string;

    @Prop({type: Date, required: true})
    dateOfRequest: Date;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }
}