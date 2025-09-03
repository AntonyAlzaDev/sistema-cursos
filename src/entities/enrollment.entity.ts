export enum EnrollmentStatus{
    ENROLLED = 'enrolled',
    WAITLIST = 'waitlist',
    COMPLETED = 'completed',
    DROPPED = 'dropped'
}

export class Enrollment{
    id: number;
    studentId: number;
    courseId: number;
    status: EnrollmentStatus;
    enrolledAt: Date;
    position?: number;
    
}