import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import * as fs from 'node:fs';
import matter from 'gray-matter';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

const getAllMarkdownFiles = (dir: string): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const files = entries.flatMap((entry) => {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      return getAllMarkdownFiles(fullPath); // 재귀적으로 탐색
    }

    if (entry.isFile() && fullPath.endsWith('.md')) {
      return [fullPath];
    }

    return [];
  });
  return files;
};

app.get('/api/posts', (req, res) => {
  const { tag } = req.query;
  const postsDir = join(process.cwd(), 'posts');
  const markdownFiles = getAllMarkdownFiles(postsDir);

  const results = markdownFiles.map((filePath) => {
    const markdown = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(markdown);
    const splittedPath = filePath.split('/');
    const slug = splittedPath[splittedPath.length - 1].replace('.md', '');
    return {
      title: parsed.data['title'],
      date: parsed.data['date'],
      tags: parsed.data['tags'],
      preview: parsed.content.slice(0, 200),
      slug,
    };
  });

  results.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (tag == null) res.json(results);
  else {
    res.json(results.filter((post) => post.tags.includes(tag)));
  }
});

app.get('/api/posts/:slug', (req, res) => {
  const { slug } = req.params;
  const postsDir = join(process.cwd(), 'posts');
  const filePath = `${postsDir}/${slug}.md`;
  const markdown = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(markdown);
  res.json({
    data: {
      tags: parsed.data['tags'],
      title: parsed.data['title'],
      date: parsed.data['date'],
    },
    content: parsed.content,
  });
});

app.get('/api/tags', (req, res) => {
  const postsDir = join(process.cwd(), 'posts');
  const markdownFiles = getAllMarkdownFiles(postsDir);

  const tagMap = new Map<string, number>();

  markdownFiles.forEach((filePath) => {
    const markdown = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(markdown);
    const tags = parsed.data['tags'];
    tags.forEach((tag: string) => {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    });
  });

  const tagNames = Array.from(tagMap.keys());
  const result = tagNames.map((tagName) => ({
    name: tagName,
    count: tagMap.get(tagName) ?? 0,
  }));

  res.json(result);
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
