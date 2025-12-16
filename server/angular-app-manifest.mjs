
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://sach-cp.github.io/hotel-booking-app-ui/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/hotel-booking-app-ui"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 5131, hash: '8a900a44a6e60f844f0a9e0488f3ef7f88ef0d42a1ea3382467617dab3573f8c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1104, hash: '53b710c26183fcdb10805e706099d23077c51677dee585392f43504a0fc53d62', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 20117, hash: '5c04e0953ddf3c874fdf3f341e57c241cd8101c4e6fc5a2b7329eeabc8d4f9b5', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-JG7EAGFK.css': {size: 230853, hash: 'YlmivfEfBiI', text: () => import('./assets-chunks/styles-JG7EAGFK_css.mjs').then(m => m.default)}
  },
};
