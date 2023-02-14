import {Injectable, NotFoundException} from '@nestjs/common';
import {DbService} from "../db/db.service";
import {TypeData} from "../data/type.data";

@Injectable()
export class NewsService {
  constructor(
    private readonly dbService: DbService
  ) {}

  async getById(id: string): Promise<TypeData> {
    const news = await this.dbService.getById(id)

    if (!news) throw new NotFoundException('News with id not found')

    return news
  }

  async findNews(search: string) {
    const data = await this.dbService.findNews(search)
    if (data.length) return data
  }

   private sortOfTags(data: TypeData[], tags: string) {
    const dataTags: string[] = tags.split(',').map(el => el.trim())
    return data.filter(news => dataTags.includes(news.tag_article))
  }

  private sortNews(data: TypeData[], sort?: string) {
    switch (sort) {
      case 'asc': {
        return  data.sort((a, b) => a.publication_date > b.publication_date ? 1 : -1)
      }
      case 'desc': {
        return data.sort((a, b) => a.publication_date > b.publication_date ? -1 : 1)
      }
      default: {
        return data
      }
    }
  }

  private countPages(data: TypeData[], limit = 10, page = 1) {
    const start = (page - 1) * limit
    const end = start + limit

    return {
      allPages: Math.round(data.length / limit),
      page: page,
      data: data.slice(start, end),
    }
  }

  async getNews(search: string, tags?: string, sort?: string, limit?: number, page?: number) {
    let data = await this.findNews(search)
    if (tags) data = this.sortOfTags(data, tags)
    return this.countPages(this.sortNews(data, sort), limit, page)
  }
}
