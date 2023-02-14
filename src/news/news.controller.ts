import {Controller, Get, Param, Query} from '@nestjs/common';
import {NewsService} from "./news.service";

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(@Query() query: Record<string, string>) {
    const { search, sort, tags, limit = 10, page = 1 } = query
    return this.newsService.getNews(search, tags, sort, +limit, +page)
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
   return this.newsService.getById(id)
  }
}
