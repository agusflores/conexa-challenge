import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll() {
    const users = await this.userRepository.findAll({
      username: 'asc',
    });

    return plainToInstance(UserDTO, users, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: string) {
    const user = await this.userRepository.findById({
      id,
    });

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    return plainToInstance(UserDTO, user, {
      excludeExtraneousValues: true,
    });
  }
}
