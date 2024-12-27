import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';

const posts = [
  { id: 0, title: 'aaa', body: 'aaaaa', created_at: new Date().toLocaleString() },
  { id: 1, title: 'bbb', body: 'bbbbb', created_at: new Date().toLocaleString() }
];

const router = new Router();

router.get('/', list)
  .get('/post/new', add)
  .get('/post/:id', show)
  .post('/post', create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function list(ctx) {
  ctx.response.type = 'text/html';
  ctx.response.body = await render.list(posts);
}

async function add(ctx) {
  ctx.response.type = 'text/html';
  ctx.response.body = await render.newPost();
}

async function show(ctx) {
  const id = ctx.params.id;
  const post = posts[id];
  if (!post) ctx.throw(404, 'Invalid post ID');
  ctx.response.type = 'text/html';
  ctx.response.body = await render.show(post);
}

async function create(ctx) {
  try {
    const body = ctx.request.body();
    console.log('Received body type:', body.type);

    if (body.type === "form") {
      const pairs = await body.value;
      console.log('Form pairs:', pairs);

      const post = {};
      for (const [key, value] of pairs) {
        console.log(`Form data - ${key}: ${value}`);
        post[key] = value;
      }

      post.created_at = new Date().toLocaleString();
      console.log('New post data:', post);

      const id = posts.push(post) - 1;
      post.id = id;

      ctx.response.redirect('/');
    } else {
      console.error('Unsupported body type:', body.type);
      ctx.throw(400, 'Invalid form submission');
    }
  } catch (error) {
    console.error('Error occurred while creating post:', error);
    ctx.throw(500, 'Internal Server Error');
  }
}

console.log('Server running at http://127.0.0.1:8080');
await app.listen({ port: 8080 });
