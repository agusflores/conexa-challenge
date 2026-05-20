import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignUpDTO {
  @ApiProperty({ example: 'john_doe', description: 'Nombre de usuario' })
  @IsString()
  username!: string;

  @ApiProperty({ example: 'secret_password', description: 'Contraseña' })
  @IsString()
  password!: string;
}
