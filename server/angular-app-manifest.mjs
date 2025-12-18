
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/hotel-booking-app-ui/',
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
    'index.csr.html': {size: 5106, hash: 'f76d3d90cf57b95903ddf650301cb2d7a3461d259c8148dcd00efd92456eb437', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1079, hash: '5e083bd9cdb75771d29ebd024a3ddcc8785ac831f1953136f5578c28b381c214', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'home/index.html': {size: 7434, hash: '22043e2dcea0c246a44a01f82b7b0807c2567ac8f36d998889046484aeb8cdd9', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 21235, hash: '02d3abde13cb45e1870c7745eedb1a047edcb7338c06f4255c291c7ebb855d34', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'signup/index.html': {size: 19755, hash: 'ed6f7b662feb315990a3cff1649d7843845456b6c30aaca0b34d2985ecbe0b2d', text: () => import('./assets-chunks/signup_index_html.mjs').then(m => m.default)},
    'styles-JG7EAGFK.css': {size: 230853, hash: 'YlmivfEfBiI', text: () => import('./assets-chunks/styles-JG7EAGFK_css.mjs').then(m => m.default)}
  },
};
