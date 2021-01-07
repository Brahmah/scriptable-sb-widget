// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: clock;
insert["/Dependencies/authentication.js"];
insert["/Dependencies/Timetable/dataGetter.js"]; // REMOVE THIS LATER
insert["/Dependencies/TapTargetHelper.js"];
insert["/Dependencies/colors.js"];
insert["/Dependencies/Timetable/widget.js"];

//-------------------------- Timetable Breakdown ----------------------------//
var timetable = {};
for (var i = 0; i < timetableData.Days.length; i++) {
  if (timetableData.Days[i].IsCurrentDay) {
    try {
      timetable.currentDay = timetableData.Days[i];
    } catch {}
    try {
      timetable.nextDay = timetableData.Days[i + 1];
    } catch {}
    try {
      timetable.previousDay = timetableData.Days[i - 1];
    } catch {}
  }
}

//----------------------------------------------- Widget ---------------------------------------------------//


//----------------------------------------------- Script Main -----------------------------------------------//
if (args.queryParameters.url) {
  await openTapTargetWebView(args.queryParameters.url);
} else {
  if (config.runsInWidget) {
    var widget =
      config.widgetFamily == "small"
        ? await createSmallWidget()
        : config.widgetFamily == "medium"
        ? await createMediumWidget()
        : await createLargeWidget();
    Script.setWidget(widget);
  } else {
    const widget = await createMediumWidget();
    widget.presentMedium();
  }
}

Script.complete();

