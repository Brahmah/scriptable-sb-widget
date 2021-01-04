// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: arrow-circle-down;
const githubBaseUrl = "https://raw.githubusercontent.com/Brahmah/schoolbox/main";

const dependenciesReq = new Request(githubBaseUrl + "/scripts.json")
const dependancies = await dependenciesReq.loadJSON();

// Determine if the user is using iCloud.
let files = FileManager.local()
const iCloudInUse = files.isFileStoredIniCloud(module.filename)

// If so, use an iCloud file manager.
files = iCloudInUse ? FileManager.iCloud() : files

// Download Authentication Handler
var authReq = new Request(githubBaseUrl + "/dependencies/authenticationHandler.js")
var authCodeString = await authReq.loadString();

// Downlaod Dependancies
for (var i=0; i < dependancies.length; i++) {
  var dependency = dependancies[i];
  // Download Dependency
  const pathToCode = files.joinPath(files.documentsDirectory(), dependency.filename);
  var codeReq = new Request(githubBaseUrl + dependency.url)
  var codeString = await codeReq.loadString();
  // Add Authentication Code To File
  var fileToBeWritten = String(codeString).replace('/*<DOWNLOADER SCRIPT SHOULD INSERT AUTH CODE HERE>*/', authCodeString)
  // Write File To Disk
  files.writeString(pathToCode, fileToBeWritten);
}
