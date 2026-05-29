import {Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {LocalAuthGuard} from "../guards/local/local.auth-guard";
import {ExtractUserIfExistsFromRequest} from "../decorators/extract-user-if-exists.decorator";
import {UserContextDto} from "../guards/dto/user-context.dto";
import {AuthService} from "../application/auth.service";
import {RegisterNewUserDto} from "./input-dto/register-new-user.input-dto";
import {RegistrationConfirmationInputDto} from "./input-dto/registration-confirmation.input-dto";
import {PasswordRecoveryInputDto} from "./input-dto/password-recovery.input-dto";
import {NewPasswordInputDto} from "./input-dto/new-pasword.input-dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
        console.log('AuthController created');
    }

    // Try login user to the system
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@ExtractUserIfExistsFromRequest() user: UserContextDto): Promise<{ accessToken: string }> {
        return this.authService.loginUser(user.id);
    };

    // Password recovery via Email confirmation. Email should be sent with RecoveryCode inside
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('password-recovery')
    async passwordRecovery(@Body() body: PasswordRecoveryInputDto): Promise<void> {
        return this.authService.passwordRecoveryByEmail(body.email);
    }

    // Confirm Password recovery
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('new-password')
    async newPassword(@Body() body: NewPasswordInputDto): Promise<void> {
        return this.authService.applyNewPassword(body.newPassword, body.recoveryCode);
    }

    // Confirm registration
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('registration-confirmation')
    async registrationConfirmation(@Body() body: RegistrationConfirmationInputDto): Promise<void>{
        return this.authService.confirmRegistration(body.code);
    }

    // Registration in the system. Email with confirmation code will be send to passed email address
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('registration')
    async registration(@Body() body: RegisterNewUserDto): Promise<void> {
        return this.authService.registerAttempt(body.login, body.password, body.email);
    }

    // Resend confirmation registration Email if user exists
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('registration-email-resending')
    async registrationEmailResending(){}

    // Get information about current user
    @Get('me')
    async requestMe(){}

// @HttpCode(HttpStatus.OK)
// @UseGuards(JwtAuthGuard)
}
