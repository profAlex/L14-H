import {Prop} from "@nestjs/mongoose";

export class Session {
    @Prop({type: String, required: true})
    userId: string;

    @Prop({type: String, required: true})
    deviceUUID: string;

    @Prop({type: String, required: true})
    deviceName: string;

    @Prop({type: String, required: true})
    deviceIP: string;

    @Prop({type: Date, required: true})
    issuedAt: Date;

    @Prop({type: Date, required: true})
    createdAt: Date;

    @Prop({type: Date, required: true})
    deletedAt: Date;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }
}