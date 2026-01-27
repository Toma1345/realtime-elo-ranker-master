import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from '../src/app.module';

describe('Player Management (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('PlayerController', () => {
    it('/player (POST) - Création de joueur', () => {
      return request(app.getHttpServer())
        .post('/player')
        .send({ id: 'NewPlayer' })
        .expect(201)
        .then((response) => {
          expect(response.body.id).toBe('NewPlayer');
        });
    });

    it('/player (GET)', () => {
      return request(app.getHttpServer())
        .get('/player')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('MatchController', () => {
    it('/match (POST) - Création de match', async () => {
      await request(app.getHttpServer()).post('/player').send({ id: 'P1' });
      await request(app.getHttpServer()).post('/player').send({ id: 'P2' });

      return request(app.getHttpServer())
        .post('/match')
        .send({ winner: 'P1', loser: 'P2', draw: false })
        .expect(201);
    });
  });
});
