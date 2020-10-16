# SimpleArticlesTask

# 1- api project
  
  I created new .net core api project and use entityframework core to create the database using EntityFramework Code First.
  
  I created comment , post tables
  
  I used asp.net identity tables for user, role tables
  
    # In StartUp class
      
      1- i added services that i need throw dependancy injection.
          
          1- mvc services
          
          2- identity services

          3- dbcontext services
          
          4- jwt services
          
          5- authorization services
          
          6- cors services
          
      2- i added middleware i need
          
          1- cors middleware
          
          2- authontication middleware
          
          3- mvc middleware
          
          
      # DbInitializer Class
      
          1- I use this class to add admin , moderator and visitor roles
          
          2- I use it also to create admin and moderator users
          
          
      # Models and ViewModels folders
      
          I add the required classes i need to work in these folders
          
          
       # Migration Folder
       
          for managing code first database creation
          
        # Controllers Folder
        
            This contains three controllers 
              
                1- AccountController
                    
                    this used for login and register functions and also create jwt token i will use in authontication
                    
                2- PostsController
                    
                    this used to return all posts , create a post and edit a post
                    
                3- Comment Controller
      
                    this used to return all comments , create a comment and edit a comment
                    
                    
                    
                    
          # Policies
          
              In startup I create two polices "AddPosts" , "EditPostsOrComments" 
              
              These policies used in controllers to specify if logged in user has access to thes function or not
              
              
  
  
# 2- angular project

  In this project i install bootstrap , ngx-bootstrap (i use modal ).
  
  I use Bootstrap Modal for adding or editting posts or comments forms
  
  I use ReactiveForms for creating all forms in the app
  
  when user is logged in as admin or moderator two items will appear in the navbar (posts , comments) these items for admin area
  
  in home page visitors can add comments from th (add comment) button and see comments on specific post from (comments) button
  
  it contains services , Guards , Interceptors ,components , models
  
  
        # 1- Services
              
              1 - AccountService
                  
                    used for login , register , logout , check User isLogedd in
                    
              2- CommentService
                
                  used for adding , editing and getting a comment
              
              3- PostsService
              
                  used for adding , editing and getting a post
                  
        
        # 2- Interceptors
        
              InterceptorService 
              
                  used to add authorization header to the request if user is logged in
              
        # 3- Guards
        
             AdminService 
              
                used to protect routes
                
                
        # 4- models
        
            comment , comment-edit , post , custom-post  
        
        # 5- components
        
              login , register , comment , home , post , navbar 
              
                all thes components has routes in app-routing
        
 
    
  
