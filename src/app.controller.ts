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

@Controller('post')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':postId')
  async getPost(@Param() params: any): Promise<any> {
    return await this.appService.getPost(params.postId);
  }

  @Get()
  async getAllPosts(): Promise<any> {
    return await this.appService.getAllPosts();
  }

  @Post()
  async createPost(@Body() body: any): Promise<any> {
    return await this.appService.createPost(body);
  }

  @Put(':postId')
  async updatePost(@Param() params: any): Promise<any> {
    return await this.appService.updatePost(params.postId);
  }

  @Delete(':postId')
  async deletePost(@Param() params: any): Promise<any> {
    return await this.appService.deletePost(params.postId);
  }
}
