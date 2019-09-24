const fetch = require('node-fetch');

var key = 'サーバーキー';
var to = 'トークン';
var notification = {
  'title': 'プッシュ通知',
  'body': 'テストテストテスト',
  'icon': 'app-icon-192.png',
  'click_action': 'https://cogent-reach-253302.firebaseapp.com/'
};

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
})