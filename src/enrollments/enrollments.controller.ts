import { Body, Controller, Get, Param, ParseIntPipe, Post, UseFilters } from '@nestjs/common';
import { CourseFullFilter, EnrollmentNotAllowedFilter, StudenLimitFilter } from 'src/filters/course.filters';
import { EnrollmentsService } from './enrollments.service';
import { StudentsService } from 'src/students/students.service';
import { CoursesService } from 'src/courses/courses.service';
import { EnrollmentDto } from 'src/dto/enrollment.dto';
import { title } from 'process';

@Controller('enrollments')
@UseFilters(CourseFullFilter, StudenLimitFilter, EnrollmentNotAllowedFilter)
export class EnrollmentsController {
    
    constructor(
        private readonly enrollmentService: EnrollmentsService,
        private readonly studentsService: StudentsService,
        private readonly coursesService: CoursesService
    ){}

    @Post()
    async enrollStudent(@Body() enrollStudentDto: EnrollmentDto){
        try{
            const enrollment = await this.enrollmentService.enrollStudent(enrollStudentDto);

            const student = this.studentsService.findOne(enrollStudentDto.studentId);
            const course = this.coursesService.findOne(enrollStudentDto.courseId);

            return{
                success: true,
                message: `${student?.name} successfully enrolled in ${course?.title}`,
                enrrollment: enrollment
            };

        }catch(error){
            throw error;
        }
    }

    @Get('student/:studentId')
    getStudentEnrollments(@Param('studentId', ParseIntPipe) studentId: number){
        const enrollments = this.enrollmentService.getStudentEnrollments(studentId);
        const student = this.studentsService.findOne(studentId);

        const enrichedAEnrollments = enrollments.map(enrollment => {

            const course = this.coursesService.findOne(enrollment.courseId);

            return {
                ...enrollment,
                courseInfo: course ? {
                    title: course.title,
                    instructor: course.instructor,
                    startDate: course.startDate,
                } : null
            };
        });

        return {
            student: student ? { id: student.id, name: student.name } : null,
            totalEnrollments: enrollments.length,
            enrollments: enrichedAEnrollments
        };
    }

    @Get('course/:courseId')
    getCourseEnrollments(@Param('courseId', ParseIntPipe) courseId: number){
        const enrollments = this.enrollmentService.getCoursesEnrollments(courseId);
        const waitList = this.enrollmentService.getCourseWaitList(courseId);
        const course = this.coursesService.findOne(courseId);

        const enrichedEnrollmets = enrollments
        .filter( e => e.status === 'enrolled')
        .map(enrollment =>{
            const student = this.studentsService.findOne(enrollment.studentId);

            return{
                ...enrollment,
                studentInfo: student ? {
                    name: student.name,
                    email: student.email
                } : null
            };
        });

        const enrichedWaitList = waitList.map( enrollment => {
            const student = this.studentsService.findOne(enrollment.studentId);
            return{
                ...enrollment,
                studentInfo: student ? {
                    name: student.name,
                    email: student.email
                } : null
            };
        });


        return {
            course: course ? {
                id: course.id,
                title: course.title,
                maxCapacity: course.maxCapacity,
                currentEnrollments: course.currentEnrollments
            } : null,

            enrolled: enrichedEnrollmets,
            waitList: enrichedWaitList,
            stats: {
                enrolled: enrichedEnrollmets.length,
                waitList: enrichedWaitList.length,
                avalible: course ? Math.max(0, course.maxCapacity - course.currentEnrollments) : 0
            }
        }




    }


}
