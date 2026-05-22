import {Controller, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
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

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<{ accessToken: string }> {
        return this.authService.loginUser(user.id);
    };

@HttpCode(HttpStatus.OK)
@UseGuards(JwtAuthGuard)
}
