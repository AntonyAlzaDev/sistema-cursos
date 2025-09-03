export class Course{
    id: number;
    title: string;
    description: string;
    maxCapacity: number;
    currentEnrollments: number;
    instructor: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}