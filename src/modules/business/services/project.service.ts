import { Project } from '@/modules/business/domain/project';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectService {
    async findAll(): Promise<Project[]> {
        return Project.findAll();
    }
}
