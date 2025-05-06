import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterStaffDto, StaffRole } from './dto/register-staff.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

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

  async registerStaff(registerStaffDto: RegisterStaffDto) {
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: registerStaffDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(registerStaffDto.password, 10);

    return await this.prisma.$transaction(async (prisma) => {
      // Crear usuario
      const usuario = await prisma.usuario.create({
        data: {
          nombre_completo: registerStaffDto.nombre_completo,
          email: registerStaffDto.email,
          hash_contrasena: hashedPassword,
        },
      });

      // Buscar el rol
      const rol = await prisma.rol.findFirst({
        where: { nombre: registerStaffDto.role, deleted: false },
      });

      if (!rol) {
        throw new Error(`Rol ${registerStaffDto.role} no encontrado`);
      }

      // Asignar rol al usuario
      await prisma.rolUsuario.create({
        data: {
          id_usuario: usuario.id,
          id_rol: rol.id,
        },
      });

      // Si es jurado, crear registro en tabla jurado
      if (registerStaffDto.role === StaffRole.JURY) {
        await prisma.jurado.create({
          data: {
            id_user: usuario.id,
            token_confirmacion: crypto.randomUUID(),
            ultima_conexion: new Date(),
          },
        });
      }

      return {
        id: usuario.id,
        email: usuario.email,
        nombre_completo: usuario.nombre_completo,
        role: registerStaffDto.role,
      };
    });
  }
}
