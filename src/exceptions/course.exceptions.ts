export class CourseFullException extends Error{

    constructor(
        public readonly courseTitle: string,
        public readonly courseId: number,
        public readonly waitlistPosition: number
    ){
        super(`El curso "${courseTitle}" está lleno. Posición en la lista de espera: ${waitlistPosition}`);
        this.name = 'CourseFullException';
    }
}

export class StudenLimitException extends Error{

    constructor(
        public readonly studentName: string,
        public readonly currentCount: number,
        public readonly maxAllowed: number = 3
    ){
        super(`${studentName} ha alcanzado el límite de  cursos (${currentCount}/${maxAllowed})`);
        this.name = 'StudenLimitException';
    }
}


export class EnrollmentNotAllowedException extends Error{

    constructor(
        public readonly reason: string,
        public readonly details: any = {}
    ){
        super(`Incripción no permitida: ${reason}`);
        this.name = 'EnrollmentNotAllowedException';
    }
}