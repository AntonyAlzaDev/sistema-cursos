import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from 'src/dto/create-student.dto';
import { Student } from 'src/entities/student.entity';

@Injectable()
export class StudentsService {

    private students: Student[] = [
        { id: 1, name: 'Ana García', email: 'ana@email.com', activeEnrollments: 1, createdAt: new Date() },
        { id: 2, name: 'Carlos López', email: 'carlos@email.com', activeEnrollments: 2, createdAt: new Date() },
        { id: 3, name: 'María Rodríguez', email: 'maria@email.com', activeEnrollments: 0, createdAt: new Date() }
    ]

    private nextId = 4

    findAll(): Student[]{
        return this.students;
    }

    findOne(id: number): Student | undefined{
        return this.students.find(student => student.id === id);
    }

    create(createStudentDTO: CreateStudentDto): Student{

        const newStudent: Student = {
            id: this.nextId++,
            ...createStudentDTO,
            activeEnrollments: 0,
            createdAt: new Date()
        };

        this.students.push(newStudent);
        return newStudent;
    }

    updateEnrollmentCount(studenId: number, delta: number): void{
        const student = this.findOne(studenId);
        if(student){
            student.activeEnrollments = Math.max(0, student.activeEnrollments + delta);
        }
    }

}
