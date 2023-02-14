import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import {TypeData} from "../data/type.data";

@Injectable()
export class DbService {
  async getAllData(): Promise<TypeData[]> {
    const pathFile = resolve(process.cwd(), 'src', 'data', 'data.json')
    return (JSON.parse(await readFile(pathFile, 'utf-8')) as { data: TypeData[] }).data
  }

  async findNews(search?: string) {
    const datas = await this.getAllData()
    if (!search) return datas
    else return datas.filter(el => el.title.toLowerCase().includes(`${search}`.toLowerCase().trim()))
  }

  async getById(id: string) {
    const data = await this.getAllData()
    return data.find(el => `${el.id}` === id) || null
  }
}
