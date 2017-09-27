var currentArticleTitle=window.location.pathname.split('/')[2];

function loadCommentForm(){
    var commentFormHtml=`
    <h5>Submit a comment</h5>
     <textarea id="comment_text" rows="5" cols="100" placeholder="Enter your comment here..."></textarea>
     <br/>
     <input type="submit" id="submit" value="Submit"/>
     <br/>
     `;
     document.getElementById('comment_form').innerHTML=commentFormHtml;
     
     //Submit username/password by login
     var submit=document.getElementById('submit')
     submit.onclick=function(){
         var request=new XMLHttpRequest();
         
         //Capture response and store it in a variable
         request.onreadystatechange=function(){
             if(request.readystate===XMLHttpRequest.DONE){
                 if(request.status===200){
                     //clear the form and reload all comments
                     document.getElementById('comment_text').value='';
                     loadComments();
                 }else{
                     alert('Error!Could not submit comment');
                 }
                 submit.value='Submit';
             }
         };
         // Make the request
        var comment = document.getElementById('comment_text').value;
        request.open('POST', '/submit-comment/' + currentArticleTitle, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({comment: comment}));  
        submit.value = 'Submitting...';
     };
}


function loadLogin(){
    //check user is already logged in
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
    if(request.readyState===XMLHttpRequest.DONE){
        if(request.status===200){
            loadCommentForm(this.responseText);
        }
    }
    };
    request.open('GET','/check-login',TRUE);
    request.send(null);
}

function escapeHTML (text)
{
    var $text = document.createTextNode(text);
    var $div = document.createElement('div');
    $div.appendChild($text);
    return $div.innerHTML;
}

function loadComments(){
    //check if user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
            var comments = document.getElementById('comments');
            if (request.status === 200) {
                var content = '';
                var commentsData = JSON.parse(this.responseText);
                for (var i=0; i< commentsData.length; i++) {
                    var time = new Date(commentsData[i].timestamp);
                    content += `<div class="comment">
                        <p>${escapeHTML(commentsData[i].comment)}</p>
                        <div class="commenter">
                            ${commentsData[i].username} - ${time.toLocaleTimeString()} on ${time.toLocaleDateString()} 
                        </div>
                    </div>`;
                }
                comments.innerHTML = content;
            } else {
                comments.innerHTML('Oops! Could not load comments!');
            }
        }
    };
    
    request.open('GET', '/get-comments/' + currentArticleTitle, true);
    request.send(null);
}

// The first thing to do is to check if the user is logged in!
loadLogin();
loadComments();
