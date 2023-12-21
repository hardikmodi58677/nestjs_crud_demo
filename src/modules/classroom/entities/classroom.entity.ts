import { Column, Entity, PrimaryGeneratedColumn, Unique, ManyToOne, Index } from 'typeorm';
import { User } from "../../user/entities/user.entity";
import { IsNotEmpty, IsInt } from 'class-validator';

@Entity()
@Unique(['name'])
@Index(['tutorId'])
export class Classroom {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @IsInt()
  @IsNotEmpty()
  @Column({ name: 'tutor_id' })
  tutorId: number;
}
