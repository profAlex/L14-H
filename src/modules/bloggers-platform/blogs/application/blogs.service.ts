import {Injectable, NotFoundException} from '@nestjs/common';
import {
    UsersExternalQueryRepository
} from '../../../user-accounts/infrastructure/external-query/users.external-query-repository';
import {UsersExternalService} from '../../../user-accounts/application/users.external-service';
import {Blog, BlogModelType} from "../domain/blog.entity";
import {InjectModel} from "@nestjs/mongoose";
import {CreateBlogDto} from "../dto/create-blog.dto";
import {BlogsCommandRepository} from "../infrastructure/blogs.command-repository";

@Injectable()
export class BlogsService {
    constructor(
        @InjectModel(Blog.name) private BlogModel: BlogModelType,
        private blogsCommandRepository: BlogsCommandRepository,
    ) {
        console.log('BlogsService created');
    }

    async createNewBlog(dto: CreateBlogDto): Promise<string> {
        const blog = this.BlogModel.createInstance({
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl
        });

        await this.blogsCommandRepository.save(blog);

        return blog.id;

        // // 🔥 ВЫВОДИМ ТО, ЧТО ПРИШЛО ИЗ КОНТРОЛЛЕРА
        // console.log('=== ДАННЫЕ В СЕРВИСЕ ===', dto);
        //
        // const blog = this.BlogModel.createInstance({
        //     name: dto.name,
        //     description: dto.description,
        //     websiteUrl: dto.websiteUrl
        // });
        //
        // // 🔥 ВЫВОДИМ ТО, ЧТО ПОЛУЧИЛОСЬ ПОСЛЕ ФАБРИКИ
        // console.log('=== ОБЪЕКТ ДЛЯ БАЗЫ ===', {
        //     name: blog.name,
        //     description: blog.description,
        //     websiteUrl: blog.websiteUrl
        // });
        //
        // await this.blogsCommandRepository.save(blog);
        // return blog.id;
    }

    async updateBlogById({blogId, name, description, websiteUrl}: {
        blogId: string,
        name: string,
        description: string,
        websiteUrl: string
    }): Promise<void> {
        const blog = await this.blogsCommandRepository.getBlogDocumentById(blogId);

        if (!blog) {
            throw new NotFoundException(`Blog with id ${blogId} not found`);
        }

        blog.updateBlog({name, description, websiteUrl});    // Если нашли, обновляем
        await this.blogsCommandRepository.save(blog);
    }

    async deleteBlogById(blogId: string): Promise<void> {
        const blog = await this.blogsCommandRepository.getBlogDocumentById(blogId);
        if (!blog) {
            throw new NotFoundException(`Blog with id ${blogId} not found`);
        }

        blog.makeDeleted();

        await this.blogsCommandRepository.save(blog);
    }
}
