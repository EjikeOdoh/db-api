import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOkResponse } from '@nestjs/swagger';
import { Staff } from 'src/staff/schema/staff.schema';
import { StaffService } from 'src/staff/staff.service';

@Injectable()
export class AuthService {
    constructor(
        private staffService: StaffService,
        private jwtService: JwtService
    ) { }

    @ApiOkResponse({
        description: 'Login successful'
    })
    async signIn(email: string, pass: string): Promise<any> {
        const staff:any = await this.staffService.findStaff(email);
        if (staff?.password !== pass) {
            throw new UnauthorizedException();
        }
        const payload = {
            sub: staff._id, role: staff.role, 
        }
        
        return {
            access_token: await this.jwtService.signAsync(payload)
        }

    }

    async getProfile(id: string) {
       return await this.staffService.findOne(id)
    }
}
