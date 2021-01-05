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
  var matchedRequiredDependencies = fileToBeWritten.match(/insert\['(.*?)'\]/g) || [];
  for (var y=0; y < matchedRequiredDependencies.length; y++) {
    var matchedDependency = matchedRequiredDependencies[y];
      // Get URL
      var matchedDependencyUrl = matchedDependency.match(/insert\['(.*?)'\]/),
      matchedDependencyUrl = matchedDependencyUrl[1],
      matchedDependencyUrl = githubBaseUrl + matchedDependencyUrl;
      // Download
      var req = new Request(matchedDependencyUrl);
      var dependencyCode = await req.loadString();
      // Replace Insert With Dependency Code
      fileToBeWritten.replace(matchedDependency, dependencyCode);
  }
  // Write File To Disk
  files.writeString(pathToCode, fileToBeWritten);
}
