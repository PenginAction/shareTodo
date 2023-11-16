import { TaskService } from './task.service';
import { Test } from '@nestjs/testing';
import { TaskResolver } from './task.resolver';
import { Status } from '@prisma/client';

describe('TaskResolverTest', () => {
  let taskResolver: TaskResolver;
  let taskService: TaskService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskResolver,
        {
          provide: TaskService,
          useValue: {
            getTasks: jest.fn().mockResolvedValue([
              {
                id: 1,
                name: 'Sample Task',
                dueDate: '2023-01-01',
                status: Status.NOT_STARTED,
                description: 'This is a sample task',
              },
              {
                id: 2,
                name: 'Sample Task2',
                dueDate: '2023-01-02',
                status: Status.IN_PROGRESS,
              },
            ]),
            createTask: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Task1',
              userId: 1,
              description: 'desc',
              dueDate: '2023-01-01',
            }),
            updateTask: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Task1',
              dueDate: '2023-01-02',
              status: Status.IN_PROGRESS,
              description: 'desc',
            }),
            deleteTask: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Task1',
              dueDate: '2023-01-02',
              status: Status.IN_PROGRESS,
              description: 'desc',
            }),
          },
        },
      ],
    }).compile();

    taskResolver = module.get<TaskResolver>(TaskResolver);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(taskResolver).toBeDefined();
    expect(taskService).toBeDefined();
  });

  describe('getTasks', () => {
    it('Valid', async () => {
      const userId = 1;
      const expected = [
        {
          id: 1,
          name: 'Sample Task',
          dueDate: '2023-01-01',
          status: Status.NOT_STARTED,
          description: 'This is a sample task',
        },
        {
          id: 2,
          name: 'Sample Task2',
          dueDate: '2023-01-02',
          status: Status.IN_PROGRESS,
        },
      ];

      const result = await taskResolver.getTasks(userId);
      expect(result).toEqual(expected);
      expect(taskService.getTasks).toHaveBeenCalledWith(userId);
    });
  });

  describe('createTasks', () => {
    it('Valid', async () => {
      const createTaskInput = {
        name: 'Task1',
        userId: 1,
        description: 'desc',
        dueDate: '2023-01-01',
      };
      const expected = { id: 1, ...createTaskInput };

      const result = await taskResolver.createTask(createTaskInput);
      expect(result).toEqual(expected);
    });
  });

  describe('updateTasks', () => {
    it('Valid', async () => {
      const updateTaskInput = {
        id: 1,
        name: 'Task1',
        dueDate: '2023-01-02',
        status: Status.IN_PROGRESS,
        description: 'desc',
      };
      const expected = { ...updateTaskInput };

      const result = await taskResolver.updateTask(updateTaskInput);
      expect(result).toEqual(expected);
    });
  });

  describe('deleteTasks', () => {
    it('Valid', async () => {
      const id = 1;
      const expected = {
        id: id,
        name: 'Task1',
        dueDate: '2023-01-02',
        status: Status.IN_PROGRESS,
        description: 'desc',
      };

      const result = await taskResolver.deleteTask(id);
      expect(result).toEqual(expected);
    });
  });
});
