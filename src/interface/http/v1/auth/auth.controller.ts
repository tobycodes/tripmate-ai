import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { AccessService } from 'src/application/access/access.service';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';
import {
  InquireAccessDto,
  inquireAccessSchema,
  RequestAccessDto,
  requestAccessSchema,
  loginSchema,
  LoginDto,
  RegisterDto,
  registerSchema,
} from './auth.schemas';
import { AuthService } from 'src/application/auth/auth.service';
import { Public, PublicGuard } from '../../guards/public.guard';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from 'src/application/user/user.entity';
import { AuthenticatedGuard } from '../../guards/authenticated.guard';

@Public()
@UseGuards(PublicGuard)
@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly accessService: AccessService,
    private readonly logger: LoggerAdapter,
    private readonly authService: AuthService,
  ) {}

  @Post('access')
  async inquireAccess(@Body() inquireAccessDto: InquireAccessDto) {
    this.logger.info('Inquiring access');

    const { email } = inquireAccessSchema.parse(inquireAccessDto);
    return this.accessService.hasAccess(email);
  }

  @Post('access/request')
  async requestAccess(@Body() requestAccessDto: RequestAccessDto) {
    this.logger.info('Requesting access');

    const dto = requestAccessSchema.parse(requestAccessDto);
    return this.accessService.requestAccess(dto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.info('Logging in');

    const { email, password } = loginSchema.parse(loginDto);
    const token = await this.authService.login(email, password);
    return { token };
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    this.logger.info('Registering');

    const { email, password, authToken } = registerSchema.parse(registerDto);
    const token = await this.authService.register(email, password, authToken);

    return { token };
  }

  @Public(false)
  @UseGuards(AuthenticatedGuard)
  @Get('me')
  async me(@AuthUser() user: User) {
    return { user };
  }
}
