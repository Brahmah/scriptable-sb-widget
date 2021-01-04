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
  const authUrl =
    DEFAULT_SCHOOLBOX_URL + "/login" || crededentials.url + "/login"; // "https://schoolbox.ilimcollege.vic.edu.au/login"
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

module.exports.presentMenu = async () => {
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
  let idx = await alert.presentAlert();
  if (crededentials == null && idx == 0) {
    crededentials = await getFromKeychainOrPrompt();
    await makeAuthRequest(crededentials);
  } else {
    clearCrededentials();
  }
};

/**
 * Helpers
 */

async function getFromKeychainOrPrompt() {
  var crededentials = getCrededentials();

  if (crededentials == null) {
    // Schoolbox URL Prompt
    var urlPrompt = await urlPrompt();
    // Username/Password Prompt
    var usernamePasswordPrompt = await usernamePasswordPrompt();
    // Create Object Of Prompt
    crededentials = {
      username: usernamePasswordPrompt.textFieldValue(0),
      password: usernamePasswordPrompt.textFieldValue(1),
      url: urlPrompt.url,
    };
  }

  if (crededentials != null) {
    return crededentials;
  }
}

async function urlPrompt() {
  let alert = new Alert();
  alert.title = "Enter SchoolBox URL";
  alert.addTextField("URL", "https://schoolbox.");
  alert.addAction("Continue");
  await alert.present();
  var isValidURL = await checkURL(alert.textFieldValue(0));
  if (!isValidURL) {
    Script.complete();
  } else {
    url = alert.textFieldValue(0);
  }
  return alert;
}

async function usernamePasswordPrompt() {
  let alert = new Alert();
  alert.title = "Enter SchoolBox URL";
  alert.title = "Enter SchoolBox Crededentials";
  alert.message = "Hope you didn't forget them";
  alert.addTextField("Username");
  alert.addSecureTextField("Password");
  alert.addCancelAction("Cancel");
  alert.addAction("Save");
  await alert.present();
  return alert;
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
    crededentials.password.length > 0 &&
    crededentials.url != null &&
    crededentials.url.length > 0
  ) {
    var authReq = await makeAuthRequest(crededentials);
    if (!authReq.error) {
      Keychain.set(usernameKey, crededentials.username);
      Keychain.set(urlKey, crededentials.url);
      Keychain.set(passwordKey, crededentials.password);
      return true;
    } else {
      return false;
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
