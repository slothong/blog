import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join, relative } from 'node:path';
import * as fs from 'node:fs';
import { PostPreview } from './models/post-preview';

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

const extractTitleAndPreview = (
  content: string
): { title: string; preview: string } => {
  const lines = content.split('\n');
  const titleLine = lines.find((line) => line.startsWith('# '));
  const title = titleLine ? titleLine.replace(/^# /, '').trim() : 'Untitled';

  const preview = lines
    .filter((line) => line.trim() && !line.startsWith('#'))
    .slice(0, 3) // 첫 3줄 정도를 preview로 사용
    .join(' ')
    .trim()
    .slice(0, 200); // 최대 200자

  return { title, preview };
};

app.get('/api/posts', (req, res) => {
  const postsDir = join(process.cwd(), 'posts');
  const markdownFiles = getAllMarkdownFiles(postsDir);

  const results: PostPreview[] = markdownFiles.map((filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { title, preview } = extractTitleAndPreview(content);
    const relativePath = relative(join(process.cwd(), 'posts'), filePath);
    const year = Number(relativePath.split('/')[0]);
    const month = Number(relativePath.split('/')[1]);
    const filename = relativePath.split('/')[2].replace('.md', '');
    return {
      id: relativePath,
      link: relativePath.replace(/\.[^/.]+$/, ''),
      title,
      preview,
      year,
      month,
      filename,
    };
  });

  res.json(results);
});

app.get('/api/posts/:year/:month/:filename', (req, res) => {
  const { year, month, filename } = req.params;
  const postsDir = join(process.cwd(), 'posts');
  const filePath = `${postsDir}/${year}/${month}/${filename}.md`;
  const content = fs.readFileSync(filePath, 'utf-8');
  res.json(content);
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
