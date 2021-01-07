async function getWidgetTapTargetUrl(URL) {
  let scriptName = String(Script.name()).replace(" ", "%20");
  return `scriptable:///run/${scriptName}?url=${URL}`;
}

async function openTapTargetWebView(URL) {
  var wv = new WebView();
  wv.loadURL(args.queryParameters.url, null, true);
  wv.present(true);
}
