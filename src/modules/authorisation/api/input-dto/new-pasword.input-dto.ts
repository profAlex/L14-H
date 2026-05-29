import {ApiProperty} from "@nestjs/swagger";

export class NewPasswordInputDto {
    @ApiProperty()
    newPassword: string;

    @ApiProperty()
    recoveryCode: string;
}