import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StaffModule } from 'src/staff/staff.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports:[StaffModule,
    JwtModule.register({
      global: true,
      secret:"Hello world",
      signOptions: {expiresIn: '1d'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
})
export class AuthModule {}
