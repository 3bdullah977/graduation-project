import { Body, Controller, HttpException, Post, UseGuards } from '@nestjs/common';
import { AllowAnonymous, AuthService } from '@thallesp/nestjs-better-auth';
import { LoginDto } from './dto/login.dto';
import { ok, error } from '../common/response';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @AllowAnonymous()
    async login(@Body() body: LoginDto) {
        try {
            const resp = await this.authService.api.signInEmail({
                body: {
                    email: body.email,
                    password: body.password,
                },
            });

            return ok(resp);
        } catch (e: any) {
            if (e instanceof HttpException) {
                return error(e);
            }

            const message =
                e?.message ?? 'Failed to login, please check your credentials.';
            return error(message, e);
        }
    }
    
    @Post('register')
    @AllowAnonymous()
    async register(@Body() body: RegisterDto) {
        try {
            const resp = await this.authService.api.signUpEmail({
                body: {
                    name: body.name,
                    email: body.email,
                    password: body.password,
                },
            });

            return ok(resp);
        } catch (e: any) {
            if (e instanceof HttpException) {
                return error(e);
            }

            const message =
                e?.message ?? 'Failed to register, please check your credentials.';
            return error(message, e);
        }
    }
    
    @Post('logout')
    @AllowAnonymous()
    async logout() {
        try {
            const resp = await this.authService.api.signOut();
            return ok(resp);
        } catch (e: any) {
            return error(e);
        }
    }
}
