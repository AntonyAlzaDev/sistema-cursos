import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from 'src/dto/create-course.dto';

@Controller('courses')
export class CoursesController {

    constructor(private readonly coursesService: CoursesService){}

    @Get()
    findAll(){
        return this.coursesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        const course = this.coursesService.findOne(id);

        if(!course){
            throw new Error('Course not found')
        }

        return course;
    }

    @Post()
    create(@Body() createCourseDto: CreateCourseDto){
        return this.coursesService.create(createCourseDto);
    }

}
