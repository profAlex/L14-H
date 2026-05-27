import {ApiProperty} from "@nestjs/swagger";

export class RegisterNewUserDto {
    @ApiProperty()
    login: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    email: string;
}