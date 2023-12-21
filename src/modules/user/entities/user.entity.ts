import { Column, Entity, PrimaryGeneratedColumn, Unique, Index } from 'typeorm';
import { Role } from "../enums/role.enum";

@Entity()
@Unique(['username'])
@Index('idx_user_role', ['role'])
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ unique: true })
  @Index('idx_user_username')
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role
  })
  role: Role;
}
