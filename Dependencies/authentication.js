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
  let alert = new Alert();
  alert.title = "Enter SchoolBox URL";
  alert.addTextField("URL", "https://schoolbox.");
  alert.addAction("Continue");
  await alert.present();
  var url = alert.textFieldValue(0);
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
