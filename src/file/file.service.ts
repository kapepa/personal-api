import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import * as path from 'path';
import * as fs from "fs";
import { Observable, from, of } from 'rxjs';

@Injectable()
export class FileService {
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(filename: string): Observable<boolean> {
    const fullPath = path.join('static', filename);
    const existFile = fs.existsSync(fullPath)

    if (existFile) {
      fs.unlinkSync(fullPath)
      return of(true)
    };

    return of(false);
  }
}
