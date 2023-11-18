import { AlbumService } from './album.service';
import { Test } from '@nestjs/testing';
import { AlbumResolver } from './album.resolver';

describe('AlbumResolverTest', () => {
  let albumResolver: AlbumResolver;
  let albumService: AlbumService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AlbumResolver,
        {
          provide: AlbumService,
          useValue: {
            getAlbums: jest.fn().mockResolvedValue([
              {
                id: 1,
                title: 'Sample Album1',
                description: 'This is a sample album1',
              },
              {
                id: 2,
                title: 'Sample Album2',
              },
            ]),
            createAlbum: jest.fn((input) => {
              if (!input.title) {
                return Promise.reject(new Error('Name is empty'));
              }
              return Promise.resolve({
                id: 1,
                title: 'Sample Album1',
                description: 'This is a sample album1',
              });
            }),
            updateAlbum: jest.fn((input) => {
              if (!input.title) {
                return Promise.reject(new Error('Name is empty'));
              }
              return Promise.resolve({
                id: 1,
                title: 'Update Album1',
                description: 'This is a sample album1',
              });
            }),
            deleteAlbum: jest.fn().mockResolvedValue({
              id: 1,
              title: 'Sample Album1',
              description: 'This is a sample album1',
            }),
          },
        },
      ],
    }).compile();

    albumResolver = module.get<AlbumResolver>(AlbumResolver);
    albumService = module.get<AlbumService>(AlbumService);
  });

  it('should be defined', () => {
    expect(albumResolver).toBeDefined();
    expect(albumService).toBeDefined();
  });

  describe('getAlbums', () => {
    it('should pass get albums', async () => {
      const userId = 1;
      const expected = [
        {
          id: 1,
          title: 'Sample Album1',
          description: 'This is a sample album1',
        },
        {
          id: 2,
          title: 'Sample Album2',
        },
      ];

      const result = await albumResolver.getAlbums(userId);
      expect(result).toEqual(expected);
      expect(albumService.getAlbums).toHaveBeenCalledWith(userId);
    });
  });

  describe('createAlbum', () => {
    it('should pass create album', async () => {
      const createAlbumInput = {
        title: 'Sample Album1',
        userId: 1,
        description: 'This is a sample album1',
      };
      const expected = {
        id: 1,
        title: 'Sample Album1',
        description: 'This is a sample album1',
      };

      const result = await albumResolver.createAlbum(createAlbumInput);
      expect(result).toEqual(expected);
    });

    it('should fail validation for name is empty', async () => {
      const createAlbumInput = {
        title: '',
        userId: 1,
        description: 'This is a sample album1',
      };
      const expected = { id: 1, ...createAlbumInput };

      await expect(albumResolver.createAlbum(expected)).rejects.toThrow();
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

      const result = await albumResolver.updateAlbum(updateAlbumInput);
      expect(result).toEqual(expected);
    });

    it('should fail validation for name is empty', async () => {
      const createAlbumInput = {
        id: 1,
        title: '',
        description: 'This is a sample album1',
      };
      const expected = { id: 1, ...createAlbumInput };

      await expect(albumResolver.updateAlbum(expected)).rejects.toThrow();
    });
  });

  describe('deleteAlbum', () => {
    it('should pass delete album', async () => {
      const id = 1;
      const expected = {
        id: id,
        title: 'Sample Album1',
        description: 'This is a sample album1',
      };

      const result = await albumResolver.deleteAlbum(id);
      expect(result).toEqual(expected);
    });
  });
});
