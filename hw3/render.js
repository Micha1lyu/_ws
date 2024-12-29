export function layout(title, content, body) 
{
    return` 
      <html>
        <head>
          <title>${title}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
          <style>
              body 
              {
              padding: 80px;
              line-height: 2;
              }
          
              h1 
              {
              font-size: 2em;
              }
          
              h2 
              {
              font-size: 1.2em;
              }
          
              #posts 
              {
              margin: 0;
              padding: 0;
              }
          
              #posts li 
              {
              margin: 40px 0;
              padding: 0;
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
              list-style: none;
              }
          
              #posts li:last-child 
              {
              border-bottom: none;
              }
          
          </style>
        </head>
        <body style="background-color: rgb(249, 254, 254);">
          <section id="content">
            <div class="container">
              ${content}
              ${body}
            </div>
          </section>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script>
        </body>
      </html>
    `
}
  export function userList(users)
  {
    let listHtml = [];
    let listUser = [...new Set (users.map(record => record.id))];

    for (let i=0 ; i<listUser.length ; i++)  
    {
        listHtml.push(`<li><a href="/${listUser[i]}/">${listUser[i]}</a></li>`);
    }
    
    return layout
    (
      '', 
      `<div>
        <p class="h1">使用者列表 User List</p>
        <br>
        <a href="/register" class="btn btn-outline-dark" role="button">Register</a>
        <br>
      </div>`, 
      `<ol style="font-size: 25px;">${listHtml.join('\n')}</ol>`
    );
  }  

  export function list(posts, post_count, post_user) 
  {
    let list = []
    let count = post_count.map(record => (record.id));

    for (let post of posts) 
    {
      list.push(`
      <li>
        <h2>#${post.id} &nbsp<a href="/${post.user}/post/${post.id}">${post.title}</a></h2>
        <h3 style="color:gray; font-size:18px;">Create by ${post.user} &nbsp ${post.time}<h3>
      </li>
      `)
    }

    let content = `
    <h1><abbr title="attribute" class="initialism">${post_user}</abbr> 's Posts</h1>
    <p>You have <strong>${count}</strong> posts!</p>
    <p>
      <a href="/${post_user}/post/new" class="btn btn-outline-primary" role="button">Create a Post</a>
      <a href="/" class="btn btn-outline-dark" role="button">Home Page</a>
    </p>
    <ul id="posts">
      ${list.join('\n')}
    </ul>
    `

    return layout('Posts', content, "")
  }
  
  export function newPost(user) 
  {
    return layout
    (
        'New Post', `
        <p class="h1">→New Post</p>
        <p class="lead">Create a new post.</p>

        <form action="/${user}/post/" method="post">
          <div class="form-floating">
            <input class="form-control" placeholder="Leave a comment here" id="floatingText" name=title></input>
            <label for="floatingText">Title</label>
          </div>

          <br>

          <div class="form-floating">
            <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 300" name=body></textarea>
            <label for="floatingTextarea2">Content</label>
          </div> 

          <br>

          <p>
            <input type="submit" class="btn btn-success" value="Create">
            <a href="/${user}/" class="btn btn-dark" role="button">Back</a>
          </p>
        </form>
        `, ""
    )
  }

  export function user_register()
  {
    return layout
    (
      "Register",
      `<p class="h1">Register a name</p>
      <br>
      <form action="/register/new_user" method="post">
        <div class="form-floating">
          <input class="form-control" placeholder="Leave a comment here" id="floatingText" name=register_user></input>
          <label for="floatingText">Input Your Name</label>
        </div>
        <br>
        <p>
            <input type="submit" class="btn btn-success" value="Register">
            <a href="/" class="btn btn-dark" role="button">Back</a>
          </p>
      </form>`,
      ""
    )
  }
  
  export function show(post) 
  {
    return layout(post.title, `
      <p class="h1">${post.title}</p>
      <h3 style="color:gray; font-size:18px;">${post.time}</h3>
      <hr>
      <pre>${post.body}</pre>
    `, "")
  }
  
