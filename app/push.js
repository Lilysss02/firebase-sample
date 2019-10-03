const fetch = require('node-fetch');

var key = 'APIキー';
var to = '取得したトークン';
var notification = {
  webpush: {
    title: 'プッシュ通知',
    body: 'テストテストテスト',
    icon: '/images/app-icon-192.png'
  },
  fcm_options: {
    link: 'https://pwa-push-254609.firebaseapp.com/'
  }
}

fetch('https://fcm.googleapis.com/fcm/send', {
  'method': 'POST',
  'headers': {
    'Authorization': 'key=' + key,
    'Content-Type': 'application/json'
  },
  'body': JSON.stringify({
    'notification': notification,
    'to': to
  })
}).then(function(response) {
  console.log(response);
}).catch(function(error) {
  console.error(error);
});