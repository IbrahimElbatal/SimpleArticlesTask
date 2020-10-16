import { CommentEdit } from './../Models/comment-edit.model';
import { Comment } from './../Models/comment.model';
import { CommentService } from './../services/comment-service.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  constructor(
      private commentService : CommentService,
      private modalService: BsModalService,
      private fb:FormBuilder
    ) { }

    comments : Comment[];

    //edit form
    editCommentForm : FormGroup;

    //form controlls
    isApproved : FormControl;
    reason : FormControl;
    
    //modal referance to use modal in ngx-bootstrap
    modalRef: BsModalRef;

    //to hold subscribe in observable
    subscribtion : Subscription;

    // to hold postid used in edit form
    commentId : number;



  ngOnInit(): void {

    this.getComments();
  }

  onEditModal(id:number , editComment:TemplateRef<any>){

    var selectedPost = this.comments.find(p => p.id ==id);
    if(selectedPost ){
      this.commentId = id; 
      this.buildEditCommentForm(selectedPost);
      this.modalRef = this.modalService.show(editComment);
    }

  }

  onEdit(){
    
    this.commentService.EditComment(this.commentId,this.editCommentForm.value)
      .subscribe(_=>{
        this.modalService.hide();
        this.editCommentForm.reset();
        this.getComments();                        
      },error=>{
        if(error.status == 401)
          alert("UnAuthorized Please login");
        else if(error.status == 403)
          alert("you don't have access to this.");
        else
        alert('UnKnown Error Occur Check your Api Service.');

        console.log(error);
      });
  }

  private buildEditCommentForm(comment : CommentEdit){
    this.isApproved = new FormControl(comment.isApproved,Validators.required);
    this.reason = new FormControl(comment.reason,Validators.required) ;
    
    
    this.editCommentForm = this.fb.group({
      "isApproved" : this.isApproved,
      "reason" : this.reason,
    });
  }

  private getComments(){
    this.commentService.GetComments()
      .subscribe(comments => this.comments = comments,
        error=>{
          if(error.status == 401)
            alert("UnAuthorized Please login");
          else if(error.status == 403)
            alert("you don't have access to this.");
          else
            alert('UnKnown Error Occur Check your Api Service.');

          console.log(error);
        });
  }
  ngOnDestroy(): void {
    if(this.subscribtion){
      this.subscribtion.unsubscribe();
    }
  }
}
