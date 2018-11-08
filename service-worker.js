const cacheId = 'cache-and-update-v8';
const cacheItems = [
'css/bootstrap.css',
'css/bootstrap.min.css',
'css/font-awesome.min.css',
'css/main.css',
'css/main.scss',
'css/roboto.css',
'fonts/fontawesome-webfont.eot',
'fonts/fontawesome-webfont.svg',
'fonts/fontawesome-webfont.ttf',
'fonts/fontawesome-webfont.woff',
'fonts/fontawesome-webfont.woff2',
'fonts/FontAwesome.otf',
'fonts/glyphicons-halflings-regular.eot',
'fonts/glyphicons-halflings-regular.svg',
'fonts/glyphicons-halflings-regular.ttf',
'fonts/glyphicons-halflings-regular.woff',
'fonts/roboto-italic.ttf',
'fonts/roboto-medium.ttf',
'fonts/roboto-regular.ttf',
'img/aip-logo.png',
'img/c4sa-logo-white.png',
'img/code4sa-logo.png',
'img/logo-152.png',
'img/logo.png',
'img/nqabile-logo.png',
'img/openup-logo.svg',
'index.html',
'js/helpers.js',
'js/l10n.js',
'js/main.js',
'js/models.js',
'js/topics.js',
'js/categories.js',
'js/vendor/backbone-1.3.3-min.js',
'js/vendor/backbone.localStorage.js',
'js/vendor/backbone.stickit-0.9.2.js',
'js/vendor/bootstrap-3.3.1.min.js',
'js/vendor/handlebars-v4.0.5.js',
'js/vendor/jquery-1.11.2.min.js',
'js/vendor/jquery.autogrow-textarea.js',
'js/vendor/modernizr-2.8.3-respond-1.4.2.min.js',
'js/vendor/moment-2.14.1.min.js',
'js/vendor/polyglot.min.js',
'js/vendor/progressbar-1.0.1.min.js',
'js/vendor/underscore-1.8.3-min.js',
'js/views/about.js',
'js/views/add_story.js',
'js/views/footer.js',
'js/views/home.js',
'js/views/settings.js',
'js/views/story.js',
'js/views/userinfo.js',
]


const ignoreRequest = ['.com']
const ignoreRequestRegex = new RegExp(`(${ignoreRequest.join('(\/?)|\\')})`);


self.addEventListener('install', function(event) {
  event.waitUntil(precache());
});


self.addEventListener('fetch', function(event) {
  if (ignoreRequestRegex.test(event.request.url)) {
    return false;
  }

  event.respondWith(fromCache(event.request));
  event.waitUntil(update(event.request));
  return true;
});


function precache() {
  return caches.open(cacheId).then(function (cache) {
    return cache.addAll(cacheItems);
  });
}


function fromCache(request) {
  return caches.open(cacheId).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}


function update(request) {
  return caches.open(cacheId).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}
