import { Test } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  album: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('AlbumServiceTest', () => {
  let albumService: AlbumService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AlbumService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    albumService = module.get<AlbumService>(AlbumService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getAlbums', () => {
    it('should pass get albums', async () => {
      const userId = 1;
      const expected = [
        {
          id: 1,
          title: 'Sample Album1',
          description: 'This is a sample album1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Sample Album2',
          description: 'This is a sample album2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPrismaService.album.findMany.mockResolvedValue(expected);

      const result = await albumService.getAlbums(userId);
      expect(result).toEqual(expected);
      expect(prismaService.album.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('createAlbum', () => {
    it('should pass create album1', async () => {
      const createAlbumInput = {
        title: 'Sample Album1',
        userId: 1,
        description: 'This is a sample album1',
      };
      const expected = { id: 1, ...createAlbumInput };
      mockPrismaService.album.create.mockResolvedValue(expected);

      const result = await albumService.createAlbum(createAlbumInput);
      expect(result).toEqual(expected);
    });

    it('should pass create album2', async () => {
      const createAlbumInput = {
        title: 'Sample Album1',
        userId: 1,
      };
      const expected = { id: 1, ...createAlbumInput };
      mockPrismaService.album.create.mockResolvedValue(expected);

      const result = await albumService.createAlbum(createAlbumInput);
      expect(result).toEqual(expected);
    });
  });

  describe('updateAlbum', () => {
    it('should pass update album', async () => {
      const updateAlbumInput = {
        id: 1,
        title: 'Update Album1',
        description: 'This is a sample album1',
      };
      const expected = { ...updateAlbumInput };
      prismaService.album.update = jest.fn().mockResolvedValue(expected);

      const result = await albumService.updateAlbum(updateAlbumInput);
      expect(result).toEqual(expected);
    });
  });

  describe('deleteAlbum', () => {
    it('should pass delete album', async () => {
      const id = 1;
      const expected = {
        id: id,
        title: 'Sample Album1',
        userId: 1,
        description: 'This is a sample album1',
      };
      prismaService.album.delete = jest.fn().mockResolvedValue(expected);

      const result = await albumService.deleteAlbum(id);
      expect(result).toEqual(expected);
    });
  });
});
