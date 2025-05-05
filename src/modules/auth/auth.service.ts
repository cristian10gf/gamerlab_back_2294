import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { 
        email: loginDto.email,
        deleted: false 
      },
      include: {
        roles: {
          where: { deleted: false },
          include: {
            rol: true
          }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.hash_contrasena);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const roles = user.roles.map(r => r.rol.nombre);

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        roles: roles
      }),
      user: {
        id: user.id,
        email: user.email,
        nombre_completo: user.nombre_completo,
        roles: roles
      },
    };
  }

  async validateUser(userId: number) {
    return this.prisma.usuario.findUnique({
      where: { 
        id: userId,
        deleted: false 
      },
      include: {
        roles: {
          where: { deleted: false },
          include: {
            rol: true
          }
        }
      }
    });
  }
}
