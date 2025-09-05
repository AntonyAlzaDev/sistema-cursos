import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { StudentsModule } from 'src/students/students.module';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [StudentsModule, CoursesModule],
  providers: [EnrollmentsService],
  controllers: [EnrollmentsController],
  exports:[EnrollmentsService]
})
export class EnrollmentsModule {}
