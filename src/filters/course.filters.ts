import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { CourseFullException, EnrollmentNotAllowedException, StudenLimitException } from "src/exceptions/course.exceptions";

@Catch(CourseFullException)
export class CourseFullFilter implements ExceptionFilter{
    catch(exception: CourseFullException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        response.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            error: 'Course Full',
            message: exception.message,
            details: {
                courseId: exception.courseId,
                courseTitle: exception.courseTitle,
                waitlistPosition: exception.waitlistPosition,
                action: 'You have been added to the waitlist',
            }
        })
        
    }
}


@Catch(StudenLimitException)
export class StudenLimitFilter implements ExceptionFilter{
    catch(exception: StudenLimitException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        response.status(HttpStatus.FORBIDDEN).json({
            statusCode: HttpStatus.FORBIDDEN,
            error: 'Enrollment Limit Exceeded',
            message: exception.message,
            details: {
                currentCount: exception.currentCount,
                maxAllowed: exception.maxAllowed,
                suggestion: 'Drop a course before enrolling in a new one',
            }
        })
    }
}

@Catch(EnrollmentNotAllowedException)
export class EnrollmentNotAllowedFilter implements ExceptionFilter{
    catch(exception: EnrollmentNotAllowedException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Enrollment Not Allowed',
            message: exception.message,
            details: {
                message: exception.message,
                details: exception.details
            }
        })
    }
}