// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: arrow-circle-down;
const githubBaseUrl = "https://raw.githubusercontent.com/Brahmah/schoolbox/main";

const dependenciesReq = new Request(githubBaseUrl + "/dependencies.json")
const dependancies = await dependenciesReq.loadJSON();

const files = FileManager.local();

// Downlaod Dependancies
for (var i=0; i < dependancies.length; i++) {
  var dependency = dependancies[i];
  const pathToCode = files.joinPath(files.documentsDirectory(), dependency.filename);
  var req = new Request(githubBaseUrl + dependency.url)
  var codeString = await req.loadString();
  files.writeString(pathToCode, codeString);
}
