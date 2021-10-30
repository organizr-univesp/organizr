import { Project } from '@/modules/business/domain/project.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectService {
    async findAll(): Promise<Project[]> {
        return Project.findAll();
    }
}
