import {ApiProperty} from "@nestjs/swagger";

export class PasswordRecoveryInputDto {
    @ApiProperty()
    email: string;
}