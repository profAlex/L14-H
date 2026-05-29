import {ApiProperty} from "@nestjs/swagger";

export class RegistrationEmailResendingInputDto {
    @ApiProperty()
    email: string
}