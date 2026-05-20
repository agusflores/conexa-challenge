import { Role } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class UserDTO {
  @Expose()
  id!: string;
  @Expose()
  username!: string;
  @Expose()
  createdAt!: Date;
  @Expose()
  role!: Role;
  @Exclude()
  password!: string;
}
