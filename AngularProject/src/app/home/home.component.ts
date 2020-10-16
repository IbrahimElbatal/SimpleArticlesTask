import { CommentsComponent } from './../comments/comments.component';
import { CommentService } from './../services/comment-service.service';
import { Comment } from './../Models/comment.model';
import { Component, OnInit, TemplateRef} from '@angular/core';
import { PostService } from '../services/post-service.service';
import { Post } from '../Models/post.model';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(
        private postService:PostService,
        private modalService: BsModalService,
        private commentService: CommentService,
        private fb:FormBuilder
      ) { }

      categoryFilter : string;

       //posts property to use in template 
       posts : Post[];

       //property to hold filtered posts
       filteredPosts : Post[];
 
       //to hold subscribe in observable
       subscribtion : Subscription;


    //create form
    createCommentForm : FormGroup;

    //form controlls
    text : FormControl;
    
    //modal referance to use modal in ngx-bootstrap
    modalRef: BsModalRef;

    // to hold post id used in edit form
    postId : number;


    //comments by post
    commentsByPost: Comment[];

    ngOnInit(): void {
      this.subscribtion = this.postService.GetPosts()
            .subscribe(
              posts=> this.posts = this.filteredPosts = posts,
              error => {
                if(error.status == 401)
                  alert("UnAuthorized Please login");
                if(error.status == 403)
                  alert("you don't have access to this.");
                else
                  alert('UnKnown Error Occur Check your Api Service.');

                console.log(error);
              });
      
    }

    filterWithCategory(){
      if(this.categoryFilter && this.categoryFilter !== '')
        this.filteredPosts = this.posts
        .filter(post => post.category.toLowerCase().includes(this.categoryFilter.toLowerCase()));
      else
        this.filteredPosts = this.posts;  
    }

    onModalOpen(postId : number , newComment : TemplateRef<any>){

      this.postId = postId;
      
      // creating form 
      this.text = new FormControl('',Validators.required) ;
      
      this.createCommentForm = this.fb.group({
        "text" : this.text,
      });

      this.modalRef = this.modalService.show(newComment);
    }

    onCreateComment(){

      var comment = new Comment();
      comment.postId = this.postId;
      comment.text = this.text.value;

      this.commentService.CreateComment(comment)
      .subscribe(_ =>{
        this.modalService.hide();
        this.createCommentForm.reset();
      },
      error => {
        if(error.status == 401)
          alert("UnAuthorized Please login");
        else if(error.status == 403)
          alert("you don't have access to this.");
        else
          alert('UnKnown Error Occur Check your Api Service.');

        console.log(error);
      });
    }

    onShowComments(postId:number , showComments){
      this.commentService.GetComments()
        .pipe(map((comments : Comment[])=>
          comments.filter(comment => comment.postId ===postId && comment.isApproved)
        ))
        .subscribe(comments => {
          this.commentsByPost = comments;
        },
        error=>{
          if(error.status == 401)
           alert("UnAuthorized Please login");
          else if(error.status == 403)
            alert("you don't have access to this.");
          else
            alert('UnKnown Error Occur Check your Api Service.');

          console.log(error);
        });
      this.modalRef = this.modalService.show(showComments);
    }
    ngOnDestroy(): void {
      this.subscribtion.unsubscribe();
    }
  
 }


