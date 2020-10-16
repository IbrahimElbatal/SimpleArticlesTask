import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../services/post-service.service';
import { Component, OnInit, TemplateRef, OnDestroy} from '@angular/core';
import { Post } from '../Models/post.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit,OnDestroy {

  constructor(
      private postService:PostService,
      private modalService: BsModalService,
      private fb:FormBuilder,
      private accountService : AccountService
      ) { }

      userRole$ :  Observable<string>
      categoryFilter : string;
      //my form
      createPostForm:  FormGroup;

      editPostForm : FormGroup;

      //form controlls
      title : FormControl;
      description : FormControl;
      file : FormControl;
      category : FormControl;
     
      //prop to hold file 
      private fileToUpload = null;
    
      //modal referance to use modal in ngx-bootstrap
      modalRef: BsModalRef;

      //posts property to use in template 
      posts : Post[];

      //property to hold filtered posts
      filteredPosts : Post[];

      //to hold subscribe in observable
      subscribtion : Subscription;
      
      // to hold postid used in edit form
      postId : number;

      openModal(createPost : TemplateRef<any>){
        this.modalRef = this.modalService.show(createPost);
      }

      ngOnInit(): void {

        this.userRole$ = this.accountService.currentRole;
        //initialize posts observable
        this.getPosts();

        //initialize create post form
        this.buildCreatePostForm();

      }

      onChange(event){
        this.fileToUpload = event.target.files[0];
      }

      onCreate(){
      
        //build formData object to send to api endPoint
        var formData = new FormData();
        formData.append("Title",this.title.value);
        formData.append("Description",this.description.value);
        formData.append("Category",this.category.value);
        formData.append("File",this.fileToUpload);
    

        this.postService.CreatePost(formData)
          .subscribe(res=>{
              this.modalService.hide();
              this.createPostForm.reset();
              // this.posts$ = this.postService.GetPosts();   
              this.getPosts()                     
          });
      }

      onEditModal(id:number , editpost:TemplateRef<any>){

        var selectedPost = this.posts.find(p => p.id ==id);
        if(selectedPost ){
          this.postId = id; 
          this.buildEditPostForm(selectedPost);
          this.openModal(editpost);
        }

      }

      onEdit(){
        var formData = new FormData();
        formData.append("Title",this.title.value);
        formData.append("Description",this.description.value);
        formData.append("Category",this.category.value);
        formData.append("File",this.fileToUpload);

        this.postService.EditPost(this.postId,formData)
          .subscribe(res=>{
            this.modalService.hide();
            this.editPostForm.reset();
            this.getPosts();                        
          });
      }

      filterWithCategory(){
        if(this.categoryFilter && this.categoryFilter !== '')
          this.filteredPosts = this.posts
          .filter(post => post.category.toLowerCase().includes(this.categoryFilter.toLowerCase()));
        else
          this.filteredPosts = this.posts;  
      }
      
      private getPosts(){
        this.subscribtion = this.postService.GetPosts()
          .subscribe(posts=> this.posts=this.filteredPosts = posts);


      }
      private buildCreatePostForm(){
        //initialize form controlls i need
        this.title = new FormControl('',Validators.required);
        this.description = new FormControl('',Validators.required) ;
        this.file = new FormControl('',Validators.required);
        this.category = new FormControl('',Validators.required);


        //build my form
        this.createPostForm = this.fb.group({
          "title" : this.title,
          "description" : this.description,
          "file" : this.file,
          "category" : this.category,
        });        
      }

      private buildEditPostForm(post){
        this.title = new FormControl(post.title,Validators.required);
        this.description = new FormControl(post.description,Validators.required) ;
        this.file = new FormControl('',Validators.required);
        this.category = new FormControl(post.category,Validators.required);
  
        
        this.editPostForm = this.fb.group({
          "title" : this.title,
          "description" : this.description,
          "file" : this.file,
          "category" : this.category,
        });
      }

      ngOnDestroy(): void {
        if(this.subscribtion){
          this.subscribtion.unsubscribe();
        }
      }
}
