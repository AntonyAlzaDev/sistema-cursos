import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from 'src/dto/create-course.dto';
import { Course } from 'src/entities/course.entity';

@Injectable()
export class CoursesService {

    private courses: Course[] = [
        {
        id: 1,
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming',
        maxCapacity: 2,  
        currentEnrollments: 1,
        instructor: 'Dr. Johnson',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-04-30'),
        isActive: true
        },
        {
        id: 2,
        title: 'React Basics',
        description: 'Introduction to React framework',
        maxCapacity: 3,
        currentEnrollments: 0,
        instructor: 'Prof. Smith',
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-05-15'),
        isActive: true
        }
    ];

    private nextId = 3;

    findAll(): Course[] {
        return this.courses.filter(course => course.isActive);
    }

    findOne(id: number): Course | undefined{
        return this.courses.find(course => course.id === id && course.isActive);
    }

    create(createCourseDto: CreateCourseDto): Course{
        const newCourse: Course = {
            id: this.nextId++,
            ...createCourseDto,
            startDate: new Date(createCourseDto.startDate),
            endDate: new Date(createCourseDto.endDate),
            currentEnrollments: 0,
            isActive: true
        };

        this.courses.push(newCourse);
        return newCourse;
    }

    updateEnrollmentCount(courseId: number, delta: number): void{
        const course = this.findOne(courseId);
        if(course){
            course.currentEnrollments = Math.max(0,course.currentEnrollments + delta);
        }
    }

    isFull(courseId: number): boolean{
        const course = this.findOne(courseId);
        return course ? course.currentEnrollments >= course.maxCapacity : false;
    }


}


