import {Controller, Post, UseGuards} from '@nestjs/common';
import {LocalAuthGuard} from "../guards/local/local.auth-guard";

@Controller('auth')
export class AuthController {
    constructor(){
        console.log('AuthController created');
    }
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(){}


}
