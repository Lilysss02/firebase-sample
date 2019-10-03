  const messaging = firebase.messaging();

  // [set_public_vapid_key]ウェブ認証情報の設定
  messaging.usePublicVapidKey('BH9Wm2qcd1V_p3FEPY3rPab5mXpqom5kwuWUMhbmxSNNqCyPa-adQ72C0s7VOGEPm8wXKyS0SvCATOvWRNAjW5M');

  // トークン、Needs Permissionの表示・非表示
  const tokenDivId = 'token_div';
  const permissionDivId = 'permission_div';
  
  // [refresh_token]新しいトークンが生成されるたびにonTokenRefreshが呼び出され、最新の登録トークンにアクセス
  messaging.onTokenRefresh(() => {
    messaging.getToken().then((refreshedToken) => {
      console.log('トークンを更新しました');
      // トークンがサーバーに送信されていない場合ためfalse
      setTokenSentToServer(false);
      // トークンをサーバーに送信
      sendTokenToServer(refreshedToken);

      // 新しいトークンの表示と表示されていたpush通知のメッセージ内容をクリア
      resetUI();

    }).catch((err) => {
      console.log('トークンを更新できませんでした ', err);
      showToken('トークンを更新できませんでした ', err);
    });
  });

  // [receive_message]
  // アプリがフォアグラウンドにある場合
  messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
  });

  function requestPermission() {
    console.log('Requesting permission...');
    // [START request_permission]
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('通知が許可されました');
        // TODO(developer): FCMで使用するトークンの取得
        resetUI();
      } else {
        console.log('通知が許可されていません');
      }
    });
  }

  // 表示の更新
  function resetUI() {
    showToken('loading...');
    // [get_token] 現在の登録トークンの取得
    messaging.getToken().then((currentToken) => {
      if (currentToken) {
        sendTokenToServer(currentToken);

        updateUIForPushEnabled(currentToken);
      } else {
        console.log('使用可能なトークンがありません。通知許可のリクエストを送ってください。');
        // Needs Permissionボタンの表示
        updateUIForPushPermissionRequired();
        setTokenSentToServer(false);
      }
    }).catch((err) => {
      console.log('トークン取得中にエラーが発生しました ', err);
      
      showToken('トークン取得エラー ', err);
      setTokenSentToServer(false);
    });
  }

  // 取得したトークンをサーバーへ送信
  function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      setTokenSentToServer(true);
    } else {
      // Token already sent to server so won\'t send it again unless it changes'
      console.log('トークンはすでにサーバーに送られているため、変更がない限り再送信されません');
    }
  }
  
  function isTokenSentToServer() {
    // getItem()でlocalStorageからデータを取り出す
    // setItem()で指定したkeyを引数に指定
    return window.localStorage.getItem('sentToServer') === '1';
  }
  
  function setTokenSentToServer(sent) {
    // setItem()でlocalStorageにデータを保存
    // 第1引数にkey、第2引数に値
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
  }

  function deleteToken() {
    // [delete_token]トークンの削除
    messaging.getToken().then((currentToken) => {
      messaging.deleteToken(currentToken).then(() => {
        console.log('トークンを削除しました');
        setTokenSentToServer(false);
        
        // トークンを削除し表示を更新
        resetUI();

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