import { Module } from '@nestjs/common';
import { EquipoModule } from './modules/equipo/equipo.module';
import { VideojuegoModule } from './modules/videojuego/videojuego.module';

import { EstudianteModule } from './modules/estudiante/estudiante.module';
import { PrismaService } from './prisma/prisma.service'
import { MateriaModule } from './modules/materia/materia.module';
import { NrcModule } from './modules/nrc/nrc.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    EquipoModule, 
    VideojuegoModule, 
    EstudianteModule,
    MateriaModule,
    NrcModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
