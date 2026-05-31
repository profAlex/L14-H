import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import {appSetup} from "../src/setup/app.setup";
import request from "supertest";

describe('UsersController and AuthController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const testingAppModule: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = testingAppModule.createNestApplication();
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

    it('POST /users and POST /auth/login - should return 201 and userview of a created user', async () => {

        const user_1 = {
            login: "qwerty1",
            password: "lg-988508",
            email: "example@example.dev"
        }
        const login = 'admin';
        const password = 'qwerty';
        const authHeader = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64');

        const createUserResponse = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', authHeader) // <--- УСТАНАВЛИВАЕМ ХЕДЕР ТУТ
            .send(user_1)
            .expect(201);

        // {
        //     "email": "example@example.dev",
        //     "login": "qwerty1",
        //     "id": "6a1c571c32d291a6d3598d47",
        //     "createdAt": "2026-05-31T15:43:24.658Z"
        // }

        expect(createUserResponse.body).toEqual({
            id: expect.any(String),
            login: user_1.login,
            email: user_1.email,
            createdAt: expect.any(String)
        });

        const createAuthLoginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({loginOrEmail: user_1.login, password: user_1.password})
            .expect(200);

        // {
        //     "accessToken" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMWM1YWM4ODdiNmFiNTlhYjg2ZDFmMiIsImlhdCI6MTc4MDI0MzE0NiwiZXhwIjoxNzgwMjQ2NzQ2fQ.jDyTdoIO-_KcGpM3pEQsDWvPLiME2TscR_7UK0H2-qk"
        // }
        // console.log("TEST_STOP: ", createAuthLoginResponse.body.accessToken.toString());

        expect(createAuthLoginResponse.body.accessToken).toBeDefined();
        expect(createAuthLoginResponse.body.accessToken).toEqual(expect.any(String));


    });


});