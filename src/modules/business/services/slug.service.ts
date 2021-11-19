import { Injectable } from '@nestjs/common';
import dashify = require('dashify');

@Injectable()
export class SlugService {
    getForName(name: string): string {
        let result: string = dashify(name).replace(/[^A-Za-z0-9-]/g, '');

        if (result.startsWith('-')) {
            result = result.substring(1);
        }

        return result;
    }
}
