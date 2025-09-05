import { Injectable } from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { EnrollmentDto } from 'src/dto/enrollment.dto';
import { Enrollment, EnrollmentStatus } from 'src/entities/enrollment.entity';
import { CourseFullException, EnrollmentNotAllowedException, StudenLimitException } from 'src/exceptions/course.exceptions';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class EnrollmentsService {


    private enrollments: Enrollment[] = [
        {
            id: 1,
            studentId: 1,
            courseId: 1,
            status: EnrollmentStatus.ENROLLED,
            enrolledAt: new Date()
        }
    ];

    private nextId = 2;

    constructor(private studentService: StudentsService,
                private courseService: CoursesService
    ){}

    async enrollStudent(enrollStudentDto: EnrollmentDto): Promise<Enrollment>{
        const { studentId, courseId } = enrollStudentDto;

        const student = this.studentService.findOne(studentId);
        const course = this.courseService.findOne(courseId);

        if(!student){
            throw new EnrollmentNotAllowedException('Student not found', {studentId});
        }

        if(!course){
            throw new EnrollmentNotAllowedException('Course not found', {courseId});
        }

        const existingEnrollment = this.enrollments.find(
            e => e.studentId === studentId &&
                 e.courseId === courseId &&
                 [EnrollmentStatus.ENROLLED, EnrollmentStatus.WAITLIST].includes(e.status)
        );

        if(existingEnrollment){
            throw new EnrollmentNotAllowedException(
                'Student already anrolled or waitlisted in this course',
                {
                    studentName: student.name,
                    courseTitle: course.title,
                    courseStatus: existingEnrollment.status
                }
            );
        }

        if(student.activeEnrollments >= 3){
            throw new StudenLimitException(student.name, student.activeEnrollments,3);
        }

        if(this.courseService.isFull(courseId)){
            const waitlistPosition = this.getWaitListPosition(courseId);

            const waitlistEnrollment: Enrollment = {
                id: this.nextId++,
                studentId,
                courseId,
                status: EnrollmentStatus.WAITLIST,
                enrolledAt: new Date(),
                position: waitlistPosition
            };

            this.enrollments.push(waitlistEnrollment);

            throw new CourseFullException(course.title, courseId, waitlistPosition);
        }

        const enrrolment: Enrollment = {
            id: this.nextId++,
            studentId,
            courseId,
            status: EnrollmentStatus.ENROLLED,
            enrolledAt: new Date(),
        };

        this.enrollments.push(enrrolment);
        this.studentService.updateEnrollmentCount(studentId,1)
        this.courseService.updateEnrollmentCount(courseId,1)

        return enrrolment;
    }

    private getWaitListPosition(courseId: number): number{
        const waitlistCount = this.enrollments.filter(
            e => e.courseId === courseId && e.status === EnrollmentStatus.WAITLIST
        ).length;

        return waitlistCount + 1;
    }

    getStudentEnrollments(studenId: number): Enrollment[]{
        return this.enrollments.filter(e => e.studentId === studenId);
    }

    getCoursesEnrollments(courseId : number): Enrollment[]{
        return this.enrollments.filter(e => e.courseId === courseId);
    }

    getCourseWaitList(courseId: number): Enrollment[]{
        return this.enrollments.filter(
            e => e.courseId === courseId && e.status === EnrollmentStatus.WAITLIST
        ).sort((a,b) => (a.position || 0) - (b.position || 0));
    }

    async dropStudent(studenId: number, courseId: number): Promise<{success: boolean; processedWaitList?: Enrollment}>{
      
        const enrollment = this.enrollments.find(
            e => e.studentId === studenId &&
                 e.courseId === courseId &&
                 e.status === EnrollmentStatus.ENROLLED
        );

        if(!enrollment){
            throw new EnrollmentNotAllowedException('Enrollment not found or already processed');
        }

        enrollment.status = EnrollmentStatus.DROPPED;

        this.studentService.updateEnrollmentCount(studenId,-1);
        this.courseService.updateEnrollmentCount(courseId,-1);

        const nextInWaitList = this.enrollments
        .filter(e => e.courseId === courseId && e.status === EnrollmentStatus.WAITLIST)
        .sort((a,b) => (a.position || 0) - (b.position || 0))[0];

        if(nextInWaitList){
            nextInWaitList.status = EnrollmentStatus.ENROLLED;
            delete nextInWaitList.position;

            this.studentService.updateEnrollmentCount(nextInWaitList.studentId, 1);
            this.courseService.updateEnrollmentCount(courseId, 1);

            return { success: true, processedWaitList: nextInWaitList}
        }

        return { success: true}

    }




}
