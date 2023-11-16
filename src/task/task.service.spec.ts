import { Test } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';

const mockPrismaService = {
  task: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TaskServiceTest', () => {
  let taskService: TaskService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getTasks', () => {
    it('valid', async () => {
      const userId = 1;
      const expected = [
        {
          id: 1,
          name: 'Sample Task',
          dueDate: '2023-01-01',
          status: Status.NOT_STARTED,
          description: 'This is a sample task',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Sample Task2',
          dueDate: '2023-01-02',
          status: Status.IN_PROGRESS,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPrismaService.task.findMany.mockResolvedValue(expected);

      const result = await taskService.getTasks(userId);
      expect(result).toEqual(expected);
      expect(prismaService.task.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('createTask', () => {
    it('Valid 1', async () => {
      const createTaskInput = {
        name: 'Task1',
        userId: 1,
        description: 'desc',
        dueDate: '2023-01-01',
      };
      const expected = { id: 1, ...createTaskInput };
      mockPrismaService.task.create.mockResolvedValue(expected);

      const result = await taskService.createTask(createTaskInput);
      expect(result).toEqual(expected);
    });

    it('Valid 2', async () => {
      const createTaskInput = {
        name: 'Task1',
        userId: 1,
        dueDate: '2023-01-01',
      };
      const expected = { id: 1, ...createTaskInput };
      mockPrismaService.task.create.mockResolvedValue(expected);

      const result = await taskService.createTask(createTaskInput);
      expect(result).toEqual(expected);
    });
  });

  describe('updateTask', () => {
    it('Valid 1', async () => {
      const updateTaskInput = {
        id: 1,
        name: 'Task1',
        dueDate: '2023-01-02',
        status: Status.IN_PROGRESS,
        description: 'desc',
      };
      const expected = { ...updateTaskInput };
      prismaService.task.update = jest.fn().mockResolvedValue(expected);

      const result = await taskService.updateTask(updateTaskInput);
      expect(result).toEqual(expected);
    });
  });

  describe('deleteTask', () => {
    it('normal', async () => {
      const id = 1;
      const expected = {
        id: id,
        name: 'Task1',
        dueDate: '2023-01-02',
        status: Status.IN_PROGRESS,
        description: 'desc',
      };
      prismaService.task.delete = jest.fn().mockResolvedValue(expected);

      const result = await taskService.deleteTask(id);
      expect(result).toEqual(expected);
    });
  });
});
