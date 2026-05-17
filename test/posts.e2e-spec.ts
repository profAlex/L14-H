import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import {appSetup} from "../src/setup/app.setup";
import request from "supertest";
import {CommentatorInfo} from "../src/modules/bloggers-platform/comments/domain/commentator-info.schema";
import {LikesInfo} from "../src/modules/bloggers-platform/comments/domain/likes-info.schema";

describe('PostsController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        appSetup(app); // не забываем подключить глобальные префиксы, пайпы
        await app.init();
    });

    afterAll(async () => {
        await request(app.getHttpServer()).delete('/testing/all-data');
        await app.close();
    });

    // Очищаем базу перед каждым тестом через специальный контроллер
    beforeEach(async () => {
        await request(app.getHttpServer()).delete('/testing/all-data');
    });


    it('GET /posts - should return 200 and paginated post list', async () => {

        // создание блога
        const createBlogResponse = await request(app.getHttpServer())
            .post('/blogs')
            .send({
                name: 'NodeJS Blog',
                description: 'Backend news',
                websiteUrl: 'https://nodejs.org',
            })
            .expect(201);

        const blog = createBlogResponse.body;

        // создание поста для этого блога
        const createPostDto = {
            title: 'NestJS Testing',
            shortDescription: 'How to write e2e tests',
            content: 'Very long and useful content about supertest...',
        };

        const createPostResponse = await request(app.getHttpServer())
            .post(`/blogs/${blog.id}/posts`)
            .send(createPostDto)
            .expect(201);

        const createdPost = createPostResponse.body;

        /*
        {
        "id": "69f629a4b705ee0b0e4b874e",
        "name": "NodeJS Blog",
        "description": "Backend news",
        "websiteUrl": "https://nodejs.org",
        "createdAt": "2026-05-02T16:43:16.921Z",
        "isMembership": true
        }
         */

        const createCommentDto = {
            relatedPostId: createdPost.id,
            content: 'comment',
            commentatorInfo: {
                userId: 'some userId',
                userLogin: 'some login',
            },
        };

        const createCommentResponse = await request(app.getHttpServer())
            .post(`/comments/`)
            .send(createCommentDto)
            .expect(201);

        // просто дополнительная проверка того, что размещение коммента отработало как надо
        expect(createCommentResponse.body).toEqual({
            id: expect.any(String),
            content: "comment",
            commentatorInfo: {
                userId: "some userId",
                userLogin: "some login"
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None"
            }
        });
        // console.log(createCommentResponse.body);

        const result = await request(app.getHttpServer())
            .get('/posts')
            .expect(200);

        expect(result.body).toEqual({
            totalCount: 1,
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            items: [
            {
                id: expect.any(String),
                title: "NestJS Testing",
                shortDescription: "How to write e2e tests",
                content: "Very long and useful content about supertest...",
                blogId: expect.any(String),
                blogName: "NodeJS Blog",
                createdAt: expect.any(String),
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None",
                    newestLikes: []
                }
            }
        ]
        });

        // console.log(result.body);

    });
});