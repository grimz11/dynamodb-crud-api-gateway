import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getPost(@Body() body: any): Promise<any> {
    return await this.appService.getPost(body);
  }

  @Get()
  async getAllPosts(): Promise<any> {
    return await this.appService.getAllPosts();
  }

  @Post()
  async createPost(@Body() body: any): Promise<any> {
    return await this.appService.createPost(body);
  }

  @Put()
  async updatePost(@Param('id') id: string): Promise<any> {
    return await this.appService.updatePost(id);
  }

  @Delete()
  async deletePost(@Param('id') id: string): Promise<any> {
    return await this.appService.deletePost(id);
  }
}
