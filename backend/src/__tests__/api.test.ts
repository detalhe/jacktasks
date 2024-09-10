import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes';
import taskRoutes from '../routes/taskRoutes';
import { authMiddleware } from '../middleware/authMiddleware';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);

jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue('hashedpassword')
}));

jest.mock('../models/User', () => ({
  createUser: jest.fn().mockResolvedValue(1),
  getUserByUsername: jest.fn().mockResolvedValue({ id: 1, username: 'testuser', password: 'hashedpassword' }),
}));

jest.mock('../models/Task', () => ({
  createTask: jest.fn().mockResolvedValue(1),
  getTasks: jest.fn().mockResolvedValue([{ id: 1, title: 'Tarefa Teste', description: 'Descrição Teste', date: new Date(), completed: false }]),
  getTaskById: jest.fn().mockResolvedValue({ id: 1, title: 'Tarefa Teste', description: 'Descrição Teste', date: new Date(), completed: false }),
  updateTask: jest.fn().mockResolvedValue(undefined),
  deleteTask: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../services/jwtService', () => ({
  generateToken: jest.fn().mockReturnValue('mockedtoken'),
  verifyToken: jest.fn().mockReturnValue({ userId: 1 }),
}));

describe('Testes da API', () => {
  describe('Rotas de Autenticação', () => {
    it('deve registrar um novo usuário', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'novousuario', password: 'senha123' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    it('não deve registrar um usuário com credenciais faltando', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'novousuario' });
      expect(res.status).toBe(400);
    });

    it('deve fazer login de um usuário existente', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'senha123' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('não deve fazer login com credenciais incorretas', async () => {
      jest.spyOn(require('../models/User'), 'getUserByUsername').mockResolvedValueOnce(null);
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'usuarioerrado', password: 'senhaerrada' });
      expect(res.status).toBe(401);
    });
  });

  describe('Rotas de Tarefas', () => {
    it('deve criar uma nova tarefa', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', 'Bearer mockedtoken')
        .send({ title: 'Nova Tarefa', description: 'Descrição da Tarefa', date: new Date() });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('deve obter todas as tarefas', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', 'Bearer mockedtoken');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('deve atualizar uma tarefa', async () => {
      const res = await request(app)
        .put('/api/tasks/1')
        .set('Authorization', 'Bearer mockedtoken')
        .send({ title: 'Tarefa Atualizada', description: 'Descrição Atualizada', completed: true });
      expect(res.status).toBe(204);
    });

    it('deve excluir uma tarefa', async () => {
      const res = await request(app)
        .delete('/api/tasks/1')
        .set('Authorization', 'Bearer mockedtoken');
      expect(res.status).toBe(204);
    });

    it('não deve acessar tarefas sem autenticação', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(401);
    });

    it('deve lidar com tarefa inexistente', async () => {
      jest.spyOn(require('../models/Task'), 'getTaskById').mockResolvedValueOnce(null);
      const res = await request(app)
        .put('/api/tasks/999')
        .set('Authorization', 'Bearer mockedtoken')
        .send({ title: 'Tarefa Inexistente' });
      expect(res.status).toBe(404);
    });
  });
});
