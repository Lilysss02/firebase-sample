// Firebase SDK
importScripts('/__/firebase/5.5.6/firebase-app.js');
importScripts('/__/firebase/5.5.6/firebase-messaging.js');
importScripts('/__/firebase/init.js');

// メッセージングオブジェクトの取得
var messaging = firebase.messaging();

// [START background_handler]アプリがバックグラウンドで動作している場合
// https://firebase.google.com/docs/cloud-messaging/js/first-message?authuser=1
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.',
    icon: '/images/app-icon-192.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});