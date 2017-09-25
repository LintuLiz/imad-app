function loadLoginForm()
{
    var loginHTML=`
    <h3>Register/Login to unlock awesome features</h3>
    <input type="text" id="username" placeholder="username"/>
    <input type="password" id="password" placeholder="*******"/>
    <input type="submit" value="Login" id="submit_btn"/>
    <input type="submit" value="Register" id="register_btn"/>
    `;
    
    document.getElementById('login_area').innerHTML=loginHTML;
//Submit username/password

var submit=document.getElementById('submit_btn');
submit.onclick=function(){
   
  //Create a request object
    var request=new XMLHttpRequest();
    
    //Capture the response and store it in a variable
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE){
            //Take some action
            if (request.status===200){
           console.log('User logged in');
           alert('Logged in successfully!');
        }else if(request.status===403){
            alert('Username/Password is incorrect!');
        }
        else if(request.status===500){
            alert('Something went wrong on the server!');
        }
        else{
             alert('Something went wrong on the server!');
        }
        loadLogin();
        }
        //Not done yet
    };
    var username=document.getElementById('username').value;
    var password=document.getElementById('password').value;
    console.log(username);
    console.log(password);
    request.open('POST','http://lintuliz.imad.hasura-app.io/login',true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({username:username,password:password}));
    submit.value='Logging in';
};  

var register=document.getElementById('register_btn');
register.onclick=function(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE){
            if(request.status===200){
                console.log('Registered');
                alert('User created successfully');
                register.value='Registered';
            }
            else{
                alert('Could not register the user');
                register.value='Register';
            }
         }
    };
    var username=document.getElementById('username').value;
    var password=document.getElementById('password').value;
    console.log(username);
    console.log(password);
    request.open('POST','/create-user',true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({username:username,password:password}));
    register.value='Registering';
};
}

function loadLoggedInUser(username)
{
    var loginArea=document.getElementById('login_area');
    loginArea.innerHTML= 
       `<h3> Hi <i>${username}</i></h3>
        <a href="/logout">Logout</a>
    `;
}

function loadLogin(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE){
            if(request.status===200){
              loadLoggedInUser(this.responseText);
            }else{
                loadLoginForm();
            }
        }
    };
    request.open('GET','/check-login', true);
    request.send(null);
}

function loadArticles(){
    
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        
      if(request.readyState===XMLHttpRequest.DONE){
          
          if(request.state===200){
              console.log('loadArticles');
              var content='<ul>';
              var articleData=json.parse(this.responseText);
              for(var i=0;i<articleData.length;i++){
                  content+=`<li>
                  <a href="/articles/${articleData[i].title}">${articleData[i].heading}</a>
                  (${articleData[i].date.split('T')[0]})</li>`;
              }
                content += "</ul>";
                articles.innerHTML = content;
          }else {
                articles.innerHTML('Oops! Could not load all articles!');
            }

      }  
    };
request.open('GET', '/get-articles', true);
request.send(null);
}

//console.log('hwllo');
// The first thing to do is to check if the user is logged in!
loadLogin();

// Now this is something that we could have directly done on the server-side using templating too!
loadArticles();

