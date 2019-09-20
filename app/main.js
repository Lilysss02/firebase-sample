// メッセージングオブジェクトの取得
const messaging = firebase.messaging();

if ('serviceWorker' in navigator) {
  // Service Workerを使うためにregister()関数を呼び出して登録
  //（firebase-messaging-sw.jsが存在する階層が自動的に設定される）
  navigator.serviceWorker.register('./firebase-messaging-sw.js').then(registration => {    
    console.log(registration);
    messaging.useServiceWorker(registration);
  }).catch(error => {
    console.error(error);
  });
}

window.addEventListener('online', e => {
    console.log('online');
}, false);

window.addEventListener('offline', e => {
    console.log('offline');
}, false);

// アプリがフォアグラウンドにある場合にプッシュ通知が届いた場合にログ出力
// https://firebase.google.com/docs/cloud-messaging/js/receive?hl=ja
messaging.onMessage(payload => {
    console.log(payload);
});

// ボタン押下のタイミングでユーザに通知権限を求める
function requestPermission() {
    messaging.requestPermission().then(() => {
        messaging.getToken().then(token => {
            console.log(token);
            const getToken = document.getElementById('token');
            getToken.innerHTML = token;
        }).catch(error => {
            console.error(error);
        });
    }).catch(error => {
      console.error(error)
    });
}