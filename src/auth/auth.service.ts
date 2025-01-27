import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StaffService } from 'src/staff/staff.service';

@Injectable()
export class AuthService {
    constructor(
        private staffService: StaffService,
        private jwtService: JwtService
    ) { }

    async signIn(username: string, pass: string): Promise<any> {
        const staff = await this.staffService.findStaff(username);
        if (staff?.password !== pass) {
            throw new UnauthorizedException();
        }
        const payload = {
            sub: staff.staffID, fName: staff.fName, lName: staff.lName
        }
        
        return {
            access_token: await this.jwtService.signAsync(payload)
        }

    }
}
