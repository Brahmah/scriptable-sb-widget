const DEFAULT_SCHOOLBOX_URL = null;

// Prefix used for items in the keychain.
let KEYCHAIN_PREFIX = "schoolbox";
// Keychain Keys
let usernameKey = KEYCHAIN_PREFIX + ".username";
let passwordKey = KEYCHAIN_PREFIX + ".password";
let urlKey = KEYCHAIN_PREFIX + ".url";

async function makeAuthRequest(crededentials) {
  crededentials = crededentials || getCrededentials();
  // Authenticate With The Server
  var authUrl = DEFAULT_SCHOOLBOX_URL || crededentials.url;
  authUrl = authUrl + "/login";
  const authReq = new Request(authUrl);
  authReq.method = "POST";
  authReq.body = `Submit=Login&page=&password=${crededentials.password}&username=${crededentials.username}`;
  authReq.headers = { "Content-Type": "application/x-www-form-urlencoded" };
  // Wait Until Request Has Finished
  var authData = await authReq.loadString();
  // Check To See If There Is An Error
  var error = authData.match(
      '<p id="error-msg" class="alert-box alert">(.*?)</p>'
    ),
    error = error[1];
  // Return error variable (or lack thereof) & Authentication
  return { error: error, authentication: "" };
}

/**
 * Menu
 */

async function presentAuthMenu() {
  var crededentials = getCrededentials();
  let alert = new Alert();
  alert.title = Script.name();
  if (crededentials == null) {
    alert.message =
      "You must authorize a connection with SchoolBox to continue.";
    alert.addAction("Authorize With SchoolBox");
  } else {
    alert.addDestructiveAction("Revoke SchoolBox Connection");
  }
  alert.addCancelAction("Cancel");
  let clickedActionId = await alert.presentAlert();
  // Authorize With SchoolBox
  if (crededentials == null && clickedActionId == 0) {
    await urlPrompt();
  }
  // Revoke SchoolBox Connection
  if (crededentials != null && clickedActionId == 0) {
    clearCrededentials();
  }
  // Canceled
  if (clickedActionId == 1) {
    Script.complete();
  }
}


async function urlPrompt() {
  let webView = new WebView();
  // Credit To SchoolBox: The HTML Page Code Is Based Off The SchoolBox Login Form.
  const htmlPage = `
	<html><head><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'><style> /*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */ html { font-family: sans-serif; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100% } body { margin: 0 } [hidden] { display: none } small { font-size: 80% } input { color: inherit; font: inherit; margin: 0 } html input[type=button], input[type=reset], input[type=submit] { -webkit-appearance: button; cursor: pointer } body, html { height: 100% } *, :after, :before { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box } body, html { font-size: 16px } body { background: #263238; color: #333; cursor: auto; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif; font-style: normal; font-weight: 400; line-height: 1.5; margin: 0; padding: 0; position: relative } div, #main, p { margin: 0; padding: 0 } p { font-family: inherit; font-size: .8125rem; font-weight: 400; line-height: 1.6; margin-bottom: .75rem; text-rendering: auto } input[type=url] { -webkit-appearance: none; -moz-appearance: none; border-radius: 0; background-color: #fff; border-style: solid; border-width: .0625rem; border-color: #c1e5ff; box-shadow: none; color: #000; display: block; font-family: inherit; font-size: .8125rem; height: 2.25rem; margin: 0 0 1rem 0; padding: .5rem; width: 100%; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; -webkit-transition: border-color .15s linear, background .15s linear; -moz-transition: border-color .15s linear, background .15s linear; -ms-transition: border-color .15s linear, background .15s linear; -o-transition: border-color .15s linear, background .15s linear; transition: border-color .15s linear, background .15s linear } input { transition: all .15s linear; min-height: 2.5rem; line-height: inherit; font-weight: 400 } input:hover { background-color: #d1ecff; color: #000; border-color: #c1e5ff } input:focus { color: #000; background-color: #d1ecff; border-color: #74c5ff; outline: 0 } body.login { margin: 0; padding: 0; background-color: #263238; background-position: top right; background-repeat: no-repeat; background-attachment: fixed; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover } #main { max-width: 400px; margin: auto; width: 80%; padding: 10px; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); } </style> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body class="side"> <div id="main"> <div class="row collapse"> <div class="small-12 column"> <input type="url" name="url" id="url" placeholder="SchoolBox URL" value="https://schoolbox."> </div> </div> <div class="row collapse"> <div class="small-12 column"> <p style="color: white">Press "Close" In The Top Left Corner To Continue</p> </div> </div> </div></body></html>
  `;
  await webView.loadHTML(htmlPage);
  await webView.present(true);

  var url = await webView.evaluateJavaScript(
    `document.getElementById("url").value`
  );
  var isValidURL = await checkURL(url);
  if (!isValidURL) {
    Script.complete();
  } else {
    await loginPrompt(url);
  }
}

async function loginPrompt(url) {
  let webView = new WebView();
  await webView.loadURL(url);
  var loginPageJS = `
    // Hide Login Button
    document.querySelector("div.small-12.column.login-links").style.display = "none";
    // Hide Remember Me
    document.querySelector("label[for=rememberme]").style.display = "none";
    // Replace Password Forget With Login Instructions
    document.querySelector("div.small-12.column p a").parentElement.innerHTML = '<p style="color:white">Press "Close" In The Top Left Corner To Login</p>';
    // Make Everything On The Footer Non-Interactive
    document.getElementById("footer").style.pointerEvents = "none";
  `;
  await webView.evaluateJavaScript(loginPageJS, false);
  await webView.present(true);

  var username = await webView.evaluateJavaScript(
    `document.getElementById("username").value`
  );
  var password = await webView.evaluateJavaScript(
    `document.getElementById("password").value`
  );
  
  var crededentials = {
    username: username,
    password: password,
    url: url
  };

  await checkAuth(crededentials)
}

function getCrededentials() {
  if (
    Keychain.contains(usernameKey) &&
    Keychain.contains(passwordKey) &&
    Keychain.contains(urlKey)
  ) {
    return {
      username: Keychain.get(usernameKey),
      password: Keychain.get(passwordKey),
      url: Keychain.get(urlKey),
    };
  } else {
    return null;
  }
}

function clearCrededentials() {
  if (Keychain.contains(usernameKey)) {
    Keychain.remove(usernameKey);
  }
  if (Keychain.contains(passwordKey)) {
    Keychain.remove(passwordKey);
  }
  if (Keychain.contains(urlKey)) {
    Keychain.remove(urlKey);
  }
}

async function checkAuth(crededentials) {
  if (
    crededentials.username != null &&
    crededentials.username.length > 0 &&
    crededentials.password != null &&
    crededentials.password.length > 0
  ) {
    var authReq = await makeAuthRequest(crededentials);
    // If No Error
    if (!authReq.error) {
      Keychain.set(usernameKey, crededentials.username);
      Keychain.set(urlKey, crededentials.url);
      Keychain.set(passwordKey, crededentials.password);
      // Show Success Message
      var alert = new Alert();
      alert.title = Script.name();
      alert.message = "Authentication Successful!";
      await alert.present();
    } else {
      // Show Error Message
      var alert = new Alert();
      alert.title = Script.name();
      alert.message = "Authentication Failed: " + authReq.error;
      await alert.present();
    }
  }
}

async function checkURL(url) {
  try {
    var req = new Request(url);
    await req.loadString();
    return true;
  } catch (error) {
    var errorAlert = new Alert();
    errorAlert.title = "Error";
    errorAlert.message = `${error}`;
    return false;
  }
}
