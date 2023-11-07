import { Injectable } from '@nestjs/common';
import { Album } from './models/album.model';

@Injectable()
export class AlbumService {
  albums: Album[] = [];

  getAlbums(): Album[] {
    const album1 = new Album();
    album1.id = 1;
    album1.title = 'album1';
    album1.description = 'album description 1';
    this.albums.push(album1);
    return this.albums;
  }
}
