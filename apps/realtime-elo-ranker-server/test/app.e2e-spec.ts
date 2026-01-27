import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request = require('supertest');

describe('Player Management (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/player (POST) - Création de joueur', () => {
    return request(app.getHttpServer())
      .post('/player')
      .send({ id: 'NewPlayer' })
      .expect(201)
      .then((response) => {
        expect(response.body.id).toBe('NewPlayer');
        expect(response.body.elo).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});