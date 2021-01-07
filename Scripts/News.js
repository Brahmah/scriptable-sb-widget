// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;
insert["/Dependencies/News/dataGetter.js"]; // REMOVE THIS LATER
insert["/Dependencies/TapTargetHelper.js"];
insert["/Dependencies/News/images.js"];
insert["/Dependencies/News/widget.js"];

if (args.queryParameters.url) {
  await openTapTargetWebView(args.queryParameters.url)
} else {
  const widget = await createWidget();
  Script.setWidget(widget);
}

Script.complete();
