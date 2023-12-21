import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Classroom } from './classroom.entity';
import { User } from '../../user/entities/user.entity';
import { IsNotEmpty, IsInt } from 'class-validator';

@Entity()
@Index(['classroomId', 'studentId'], { unique: true })
export class ClassroomStudents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'classroom_id' })
  @IsNotEmpty()
  @IsInt()
  classroomId: number;

  @Column({ name: 'student_id' })
  @IsNotEmpty()
  @IsInt()
  studentId: number;

  @ManyToOne(() => Classroom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classroom_id', referencedColumnName: 'id' })
  classroom: Classroom;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id', referencedColumnName: 'id' })
  student: User;
}
