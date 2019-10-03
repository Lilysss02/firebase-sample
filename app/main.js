// [get_messaging_object]
const messaging = firebase.messaging();
// [set_public_vapid_key]ウェブ認証情報の設定
messaging.usePublicVapidKey('BH9Wm2qcd1V_p3FEPY3rPab5mXpqom5kwuWUMhbmxSNNqCyPa-adQ72C0s7VOGEPm8wXKyS0SvCATOvWRNAjW5M');
// トークン、Needs Permissionの表示・非表示
const tokenDivId = 'token_div';
const permissionDivId = 'permission_div';

// アプリがフォアグラウンドにある場合
messaging.onMessage((payload) => {
console.log('Message received. ', payload);
});

// 通知許可リクエスト
function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
        console.log('通知が許可されました');
        // FCMで使用するトークンの取得
        resetUI();
        } else {
        console.log('通知が許可されていません');
        }
    });
}

// 通知解除ボタン
// function removeNotification() {
//     Notification.requestPermission().then((permission) => {
//         if (permission === 'granted') {
//             deleteToken();
//         }
//     })
// }

// 表示の更新
function resetUI() {
    showToken('loading...');
    // [get_token] 現在の登録トークンの取得
    messaging.getToken().then((currentToken) => {
        if (currentToken) {
            setTokenSentToServer(currentToken);
            // sendTokenToServer(currentToken);
            updateUIForPushEnabled(currentToken);
        } else {
            // No Instance ID token available. Request permission to generate one.
            console.log('使用可能なトークンがありません。通知許可のリクエストを送ってください。');
            // Needs Permissionボタンの表示
            updateUIForPushPermissionRequired();
            setTokenSentToServer(false);
        }
    }).catch((err) => {
        console.log('トークン取得中にエラーが発生しました ', err);
        
        showToken('トークン取得エラー ', err);
        // setTokenSentToServer(false);
    });
}

function setTokenSentToServer(currentToken) {
    console.log(currentToken);

    fetch('http://127.0.0.1:8000/api/pushes', {
        method: 'POST',
        body: JSON.stringify({
            token: currentToken
        }),
        headers: {
            'Accept': 'application/json',
            // Conte-tTypeがapplication/jsonのため、（実際のリクエストの前に）Preflightリクエストが送信される
            // リクエストメソッドはOPTIONSになる
            'Content-Type': 'application/json',
        },
    // レスポンスのJSONを解析
    }).then(res => res.json())
      .then(console.log)
      .catch(console.error);
}

function deleteToken() {
    // [delete_token]トークンの削除
    messaging.getToken().then((currentToken) => {
        messaging.deleteToken(currentToken).then(() => {
            console.log('トークンを削除しました');
            setTokenSentToServer(false);
            
            // トークンを削除しRequestPermissionボタンを表示
            updateUIForPushPermissionRequired()
        }).catch((err) => {
            console.log('トークンを削除できません ', err);
        });
    }).catch((err) => {
        console.log('トークンの取得エラー ', err);
        showToken('トークンの取得エラー ', err);
    });
}

function showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
        div.style = 'display: visible';
    } else {
        div.style = 'display: none';
    }
}

// トークンの表示
function showToken(currentToken) {
    var tokenElement = document.querySelector('#token');
    tokenElement.textContent = currentToken;
}

function updateUIForPushEnabled(currentToken) {
    showHideDiv(tokenDivId, true);
    // Needs Permissionボタンを非表示
    showHideDiv(permissionDivId, false);
    // トークンを表示
    showToken(currentToken);
}

function updateUIForPushPermissionRequired() {
    // トークン非表示
    showHideDiv(tokenDivId, false);
    // Needs Permissionボタンを表示
    showHideDiv(permissionDivId, true);
}

resetUI();