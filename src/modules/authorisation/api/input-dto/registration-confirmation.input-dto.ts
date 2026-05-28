import {ApiProperty} from "@nestjs/swagger";

export class RegistrationConfirmationInputDto {
    @ApiProperty()
    code: string
}