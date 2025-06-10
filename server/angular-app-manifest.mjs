
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/posts"
  },
  {
    "renderMode": 2,
    "route": "/2025/06/a"
  },
  {
    "renderMode": 0,
    "route": "/*/*/*"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 628, hash: 'c81834b62e552e51f2cd5e80258d587cba0fae8987caab061c5e83d4173f6e7d', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1001, hash: '3838a03123f8be6aa04132431e03aab1115daed4a3d228f5a1db45e24b46547b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    '2025/06/a/index.html': {size: 2251, hash: '012f605dc6a2a21a74041c3a758ff14d0dd88bed7392457bf8dad56375bbb145', text: () => import('./assets-chunks/2025_06_a_index_html.mjs').then(m => m.default)},
    'posts/index.html': {size: 2832, hash: 'fcb91bad907bfda89aada000e6ae8c4ba165f530aa897873605e91e7aa4ed37f', text: () => import('./assets-chunks/posts_index_html.mjs').then(m => m.default)},
    'index.html': {size: 2847, hash: '48c86960affbe7ae40c5ce62c8f277358871c59a4c733e59fb8a507fb1e0e4c7', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-6MNKEPE3.css': {size: 42, hash: 'p549GWiaEy0', text: () => import('./assets-chunks/styles-6MNKEPE3_css.mjs').then(m => m.default)}
  },
};
