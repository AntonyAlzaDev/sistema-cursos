import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from 'src/dto/create-student.dto';

@Controller('students')
export class StudentsController {
    
    constructor(private readonly studensService: StudentsService){}


    @Get()
    findAll(){
        return this.studensService.findAll();
    }

    @Get(':id')
    findOne(@Param('id',ParseIntPipe) id: number){
        const student = this.studensService.findOne(id);

        if(!student){
            throw new Error('Student not found')
        }

        return student;
    }

    @Post()
    create(@Body() createstudentDto: CreateStudentDto){
        return this.studensService.create(createstudentDto);
    }

}
