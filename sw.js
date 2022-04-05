const version = 'v1.0.1'

// 注册缓存机制
this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(version).then(function(cache) {
            return cache.addAll([
                '/index.html',
                '/css/',
                '/js/',
                '/src/',
                '/manifest.json'
            ])
        })
    )
})

// 请求触发
self.addEventListener('fetch', function(event) {
    event.respondWith(
        // 尝试从缓存中获取资源
        caches.match(event.request).then(function(response) {
            // 获取失败，尝试从服务器获取
            return response || fetch(event.request).then(function(response) {
                // 尝试将获取到的内容缓存下来
                return caches.open(version).then(function(cache) {
                    cache.put(event.request, response.clone())
                    return response
                })
            })
        })
    )
})