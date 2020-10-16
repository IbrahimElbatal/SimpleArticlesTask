import { CommentEdit } from './../Models/comment-edit.model';
import { Comment } from './../Models/comment.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../Models/post.model';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private url = "http://localhost:5000/api/comment";

  constructor(private http: HttpClient) { }

  GetComments() : Observable<Comment[]>{
    return this.http.get<Comment[]>(`${this.url}/get`)
            .pipe(shareReplay());
  }

  CreateComment(comment:Comment) :Observable<any>{
    return this.http.post<Comment>(`${this.url}/createComment`,comment);
  }
  
  EditComment(id : number , commentEdit:CommentEdit) :Observable<any>{
    return this.http.put<CommentEdit>(`${this.url}/EditComment/${id}`,commentEdit);
  }
}
