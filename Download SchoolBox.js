// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: arrow-circle-down;
const githubBaseUrl = "https://raw.githubusercontent.com/Brahmah/schoolbox/main";

const scriptsReq = new Request(githubBaseUrl + "/scripts.json")
const scripts = await scriptsReq.loadJSON();

// Determine if the user is using iCloud.
let files = FileManager.local()
const iCloudInUse = files.isFileStoredIniCloud(module.filename)

// If so, use an iCloud file manager.
files = iCloudInUse ? FileManager.iCloud() : files

// Downlaod Scripts
for (var i=0; i < scripts.length; i++) {
  var script = scripts[i];
  var fileToBeWritten = "";
  // Download Script
  const pathToCode = files.joinPath(files.documentsDirectory(), script.filename);
  var codeReq = new Request(githubBaseUrl + script.url)
  fileToBeWritten = await codeReq.loadString();
  // Download Dependencies
  var matchedRequiredDependencies = fileToBeWritten.match(/insert\['(.*?)'\]/g);
  log(matchedRequiredDependencies)
// Will log ["@Emran", "@Raju", "@Noman"]
  //var authReq = new Request(githubBaseUrl + "/dependencies/authenticationHandler.js")
  //var authCodeString = await authReq.loadString();
  //fileToBeWritten = String(fileToBeWritten).replace('/*<DOWNLOADER SCRIPT SHOULD INSERT AUTH CODE HERE>*/', authCodeString)
  // Write File To Disk
  //files.writeString(pathToCode, fileToBeWritten);
}
