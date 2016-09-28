"use strict";
/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */

(function (global) {
  System.config({
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',
      // angular bundles
      '@angular/core': '@angular/core/bundles/core.umd.js',
      '@angular/common': '@angular/common/bundles/common.umd.js',
      '@angular/compiler': '@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': '@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': '@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': '@angular/http/bundles/http.umd.js',
      '@angular/router': '@angular/router/bundles/router.umd.js',
      '@angular/forms': '@angular/forms/bundles/forms.umd.js',

      // other libraries
      'rxjs':                       'rxjs',
      'ng2-cookies':                'ng2-cookies',
      'socket.io-client':           'socket.io-client/socket.io.js',
      'lodash':                     'lodash/lodash.js',
      'angular2-in-memory-web-api': 'angular2-in-memory-web-api'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: 'main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'ng2-cookies': {
        defaultExtension: 'js'
      },
      'socket.io-client': {
        defaultExtension: 'js'
      },
      'lodash': {
        defaultExtension: 'js'
      },
      'angular2-in-memory-web-api': {
        main: 'server/server.js',
        defaultExtension: 'js'
      }
    }
  });
})(this);
