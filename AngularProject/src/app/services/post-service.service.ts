import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../Models/post.model';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  
  private url = "http://localhost:5000/api/posts";

  constructor(private http: HttpClient) { }

  GetPosts() : Observable<Post[]>{
    return this.http.get<Post[]>(`${this.url}/get`)
            .pipe(shareReplay());
  }

  CreatePost(post:FormData) :Observable<any>{
    return this.http.post<Post>(`${this.url}/createPost`,post);
  }
  
  EditPost(id : number , post:FormData) :Observable<any>{
    return this.http.put<Post>(`${this.url}/EditPost/${id}`,post);
  }
}
