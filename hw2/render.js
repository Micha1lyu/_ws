export function list(posts) {
  let html = '<h1>Posts</h1>';
  html += '<a href="/post/new">Create New Post</a>';
  html += '<ul>';
  for (const post of posts) {
    html += `<li><a href="/post/${post.id}">${post.title}</a> - ${post.created_at}</li>`;
  }
  html += '</ul>';
  return html;
}

export function show(post) {
  return `<h1>${post.title}</h1>
    <p>${post.body}</p>
    <small>Posted at: ${post.created_at}</small>
    <p><a href="/">Back</a></p>`;
}

export function newPost() {
  return `<h1>Create New Post</h1>
    <form action="/post" method="post">
      <p>Title: <input type="text" name="title" required></p>
      <p>Body: <textarea name="body" required></textarea></p>
      <p><button type="submit">Create</button></p>
    </form>`;
}
