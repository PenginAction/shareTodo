import { Injectable } from '@nestjs/common';
import { Album } from './models/album.model';
import { CreateAlbumInput } from './dto/createAlbum.input';

@Injectable()
export class AlbumService {
  albums: Album[] = [];

  getAlbums(): Album[] {
    return this.albums;
  }

  createAlbum(createAlbumInput: CreateAlbumInput): Album {
    const { title, description } = createAlbumInput;
    const newAlbums = new Album();
    newAlbums.id = this.albums.length + 1;
    newAlbums.title = title;
    newAlbums.description = description;
    this.albums.push(newAlbums);
    return newAlbums;
  }
}
