
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://sach-cp.github.io/hotel-booking-app-ui/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/hotel-booking-app-ui/login",
    "route": "/hotel-booking-app-ui"
  },
  {
    "renderMode": 2,
    "route": "/hotel-booking-app-ui/login"
  },
  {
    "renderMode": 2,
    "route": "/hotel-booking-app-ui/signup"
  },
  {
    "renderMode": 2,
    "route": "/hotel-booking-app-ui/home"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 5131, hash: '8ea9d20d79432a1a3690ae51faf8d8fd18bd993315f0f06309d98ace06d340d8', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1104, hash: '359ff0f563cc77d87fbb8fccd1bbbdd886d0452a108c345cd1912f9464c73b21', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'home/index.html': {size: 7459, hash: '4fef6ae6ee7697cc1a333ee980275b94022808bb082a9e6afcd878a8a9a3f786', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'signup/index.html': {size: 19805, hash: '998c32d8fc5fac8b536df1c4ced45b3d66f9a30ce624a18a8aed3ffd816d66ef', text: () => import('./assets-chunks/signup_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 21285, hash: 'a0d95ca46ef3d888201a361eaf567fa35f50be86087be63e4fd267930cb1557f', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-JG7EAGFK.css': {size: 230853, hash: 'YlmivfEfBiI', text: () => import('./assets-chunks/styles-JG7EAGFK_css.mjs').then(m => m.default)}
  },
};
