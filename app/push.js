const fetch = require('node-fetch');

var key = 'AAAAeucTVq8:APA91bFzhpJOJXNmSL8RGtKWG8ylwHlQDBKyQtHfDzF8LSlEDwXmyYK0bUx7urpzVVq_k7WMGHuXYZk9VtnAl0hiIrIyM83mkoQHsrCVza7zv6BetCWcrwDAXW8tIzQ00rsPRZ2BQJNH';
var to = 'cfkNs5UDQD0:APA91bGNwmTeUp2Wf2SdH7JmVui_uojPzeiDL7jtiC9IEII4e8uDAPKaTU4dvSr_22WYhY0K5IkFrqQlDWhYTzjhezq_gwdguXUGEBRxSGz1WKsy6rx9Yl50MJAnV7zYeqdMOU8yEXJc';
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