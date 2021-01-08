// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: clock;
insert["/Dependencies/authentication.js"];
insert["/Dependencies/Timetable/dataGetter.js"]; // REMOVE THIS LATER
insert["/Dependencies/TapTargetHelper.js"];
insert["/Dependencies/colors.js"];
insert["/Dependencies/Timetable/widget.js"];

//----------------------------------------------- Widget ---------------------------------------------------//

//----------------------------------------------- Script Main -----------------------------------------------//
if (args.queryParameters.url) {
  await openTapTargetWebView(args.queryParameters.url);
} else {
  if (config.runsInWidget) {
    await setWidget();
  } else {
    const widget = await createMediumWidget();
    widget.presentMedium();
  }
}

Script.complete();
