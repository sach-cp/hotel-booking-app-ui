
export default {
  basePath: '/hotel-booking-app-ui',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
