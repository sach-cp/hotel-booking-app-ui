
export default {
  basePath: 'https://sach-cp.github.io/hotel-booking-app-ui',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
