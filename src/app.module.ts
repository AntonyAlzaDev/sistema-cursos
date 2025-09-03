import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { StudendsService } from './studends/studends.service';

@Module({
  imports: [StudentsModule, CoursesModule, EnrollmentsModule, AnalyticsModule],
  controllers: [AppController],
  providers: [AppService, StudendsService],
})
export class AppModule {}
