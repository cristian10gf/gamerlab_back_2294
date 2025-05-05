import { Rol } from '@prisma/client';

export interface User {
  id: number;
  nombre_completo: string;
  email: string;
  hash_contrasena: string;
  roles?: Rol[];
}
