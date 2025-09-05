import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { StudentsService } from './students/students.service';

@Module({
  imports: [StudentsModule, CoursesModule, EnrollmentsModule, AnalyticsModule],
  controllers: [AppController],
  providers: [AppService, StudentsService],
})
export class AppModule {}
