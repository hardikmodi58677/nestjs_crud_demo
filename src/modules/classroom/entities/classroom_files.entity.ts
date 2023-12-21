import { IsInt, IsNotEmpty } from "class-validator";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Classroom,File } from '.'
import { User } from "../../user/entities"

@Entity()
@Entity()
@Index(['fileId', 'tutorId', 'classroomId'], { unique: true })
export class ClassroomFiles {
  
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => File, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'file_id', referencedColumnName: 'id' })
  @IsNotEmpty()
  @IsInt()
  fileId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutor_id', referencedColumnName: 'id' })
  @IsNotEmpty()
  @IsInt()
  tutorId: number;

  @ManyToOne(() => Classroom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classroom_id' })
  @IsNotEmpty()
  @IsInt()
  classroomId: number;
}