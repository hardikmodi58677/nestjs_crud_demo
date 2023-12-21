import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './enums/role.enum';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(username: string, password: string): Promise<User> {
    console.log('Creating user');
    const user = new User();
    user.username = username;
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.role = Math.random() > 0.5 ? Role.Tutor : Role.Student;
    return this.userRepository.save(user);
  }

  async findOne(username: string, password: string): Promise<User | null> {
    const existingUser = await this.userRepository.findOneBy({ username });
    if (!existingUser) {
      return this.create(username, password);
    }
    return existingUser;
  }
}
