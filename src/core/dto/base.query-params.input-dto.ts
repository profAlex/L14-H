import { Type } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";


export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}
//базовый класс для query параметров с пагинацией
//значения по-умолчанию применятся автоматически при настройке глобального ValidationPipe в main.ts
export class BaseQueryParams {
  //для трансформации в number
  @ApiProperty({required: false})
  @Type(() => Number)
  pageNumber: number = 1;

  @ApiProperty({required: false})
  @Type(() => Number)
  pageSize: number = 10;

  @ApiProperty({required: false})
  sortDirection: SortDirection = SortDirection.Desc;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

