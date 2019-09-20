// fcmを使うための設定
importScripts('/__/firebase/4.6.2/firebase-app.js');
importScripts('/__/firebase/4.6.2/firebase-messaging.js');
importScripts('/__/firebase/init.js');

const cacheName = 'v1';
const urlsToCache = [
    './',
    './main.js'
];

// メッセージングオブジェクトの取得
const messaging = firebase.messaging();

// Service Workerを新規インストール、もしくは更新されているとinstalling状態になる
self.addEventListener('install', event => {
    // waitUntil() : この関数が呼ばれたイベント終了のライフタイムをその処理が終わるまで待つ
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            // 指定されたリソースをキャッシュに追加
            return cache.addAll(urlsToCache).then(() => {
                // skipWaiting()でactive状態にできる
                self.skipWaiting();
            });
        })
    );
});

self.addEventListener('activate', event => {
    console.log('activate');  
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

// アプリがバックグラウンドにある場合にプッシュ通知が届いた場合にログ出力
// https://firebase.google.com/docs/cloud-messaging/js/receive?hl=ja
messaging.setBackgroundMessageHandler(payload => {
    console.log(payload);
    const title = 'Background Message Title';
    const options = {
      body: 'Background Message body.',
      icon: '/images/icon-192.png',
      click_action: 'https://github.com/'
    };

    return self.registration.showNotification(title, options);
});

// ユーザが通知をクリックするとnotificationclickイベントリスナーが呼び出される
self.addEventListener('notificationclick', event => {
    console.log('[Service Worker] Notification click Recieved.');
    // クリックされた通知を閉じる
    event.notification.close();
    // 新しいウィンドウまたはタブを開く
    event.waitUntil(
        clients.openWindow('/')
    );
});