import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
        secret: 'nigga-dont=peek',
        signOptions: { expiresIn: '10h' },
    }),
],
controllers: [AuthController],
providers: [AuthService, UsersService, JwtStrategy],

})
export class AuthModule {}
