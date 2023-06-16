// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url: 'https://adamroldanapi-production.up.railway.app/',
  // url: 'http://localhost:8086/'
  firebaseConfig: {
    apiKey: "AIzaSyD0VIF4tWVb8MSLY1T8nQZWU9c88BOYT3U",
    authDomain: "adamroldan-web.firebaseapp.com",
    projectId: "adamroldan-web",
    storageBucket: "adamroldan-web.appspot.com",
    messagingSenderId: "137860762844",
    appId: "1:137860762844:web:30f112c4c571b4b8aaf819",
    measurementId: "G-PQYN7MLLJS"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.