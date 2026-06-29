import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: any;
            email: any;
            fullName: any;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
        };
    }>;
    refresh(body: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
    }>;
}
