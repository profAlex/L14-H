import {Controller, Get, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {LocalAuthGuard} from "../guards/local/local.auth-guard";
import {ExtractUserIfExistsFromRequest} from "../decorators/extract-user-if-exists.decorator";
import {UserContextDto} from "../guards/dto/user-context.dto";
import {AuthService} from "../application/auth.service";
import {JwtAuthGuard} from "../guards/bearer/jwt.auth-guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
        console.log('AuthController created');
    }

    // Try login user to the system
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<{ accessToken: string }> {
        return this.authService.loginUser(user.id);
    };

    // Password recovery via Email confirmation. Email should be sent with RecoveryCode inside
    @Post('password-recovery')
    passwordRecovery(){}

    // Confirm Password recovery
    @Post('new-password')
    newPassword(){}

    // Confirm registration
    @Post('registration-confirmation')
    registrationConfirmation(){}

    // Registration in the system. Email with confirmation code will be send to passed email address
    @Post('registration')
    registration(){ }

    // Resend confirmation registration Email if user exists
    @Post('registration-email-resending')
    registrationEmailResending(){}

    // Get information about current user
    @Get('me')
    requestMe(){}

// @HttpCode(HttpStatus.OK)
// @UseGuards(JwtAuthGuard)
}
