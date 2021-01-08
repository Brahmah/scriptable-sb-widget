async function setWidget() {
  var widget =
    config.widgetFamily == "small"
      ? await createSmallWidget()
      : config.widgetFamily == "medium"
      ? await createMediumWidget()
      : await createLargeWidget();
  Script.setWidget(widget);
}
//------------------------------ LARGE WIDGET -------------------------------//
async function createLargeWidget() {
  let widget = await generateWidgetBoilerplate();
  //---------------- Widget Header ----------------------//
  await addHeader(widget, "Today");
  //----------------- Widget Main -----------------------//
  let main = widget.addStack();
  main.spacing = 10;
  main.layoutVertically();
  //------------------- Schedules -----------------------//
  var maximumInWidget = 6;
  var dayToBeDisplayed = timetable.currentDay;
  for (var i = 0; i < dayToBeDisplayed.Schedules.length; i++) {
    // Widget can only contain soo many events
    if (i < maximumInWidget) {
      await addSchedule(main, i, dayToBeDisplayed.Schedules[i]);
    }
  }
  widget.addSpacer();
  // Return
  return widget;
}

//--------------------------- MEDIUM WIDGET -------------------------------//
async function createMediumWidget() {
  let widget = await generateWidgetBoilerplate();
  //---------------- Widget Header ----------------------//
  await addHeader(widget, "Today");
  //----------------- Widget Main -----------------------//
  let main = widget.addStack();
  main.spacing = 10;
  //--------------- Schedules Container -----------------//
  var twoSidedStack = await addTwoSidedStack(main);
  //------------------- Schedules -----------------------//
  var maximumInWidget = 6;
  for (var i = 0; i < timetable.currentDay.Schedules.length; i++) {
    // Widget can only contain soo many events
    if (i < maximumInWidget) {
      // check if i is even
      if(i % 2 == 0) {
        await addSchedule(twoSidedStack.leftStack, i, timetable.currentDay.Schedules[i]);
      }
      else {
        await addSchedule(twoSidedStack.rightStack, i, timetable.currentDay.Schedules[i]);
      }
    }
  }
  widget.addSpacer();
  // Return
  return widget;
}

//---------------------------- SMALL WIDGET -------------------------------//
async function createSmallWidget() {
  let widget = await generateWidgetBoilerplate();
  //---------------- Widget Header ----------------------//
  await addHeader(widget, "Up Next");
  //------------- Schedules Container -------------------//
  let schedulesStack = widget.addStack();
  schedulesStack.layoutVertically();
  schedulesStack.spacing = 4;
  //------------------- Schedules -----------------------//
  var maximumInWidget = 3;
  var schedulesQualifyingSoFar = 0;
  for (var i = 0; i < timetable.currentDay.Schedules.length; i++) {
    if (!timetable.currentDay.Schedules[i].HasPassed) {
      // Widget can only contain soo many events
      schedulesQualifyingSoFar++
      if (schedulesQualifyingSoFar <= maximumInWidget) {
        await addSchedule(schedulesStack, i, timetable.currentDay.Schedules[i]);
      }
    } 
  }
  widget.addSpacer();
  // Return
  return widget;
}

//------------------------ WIDGET FUNCTIONS ----------------------------//
async function generateWidgetBoilerplate() {
  let widget = new ListWidget();
  widget.backgroundColor = Color.dynamic(Color.white(), new Color("#1c1c1e"));
  return widget
}

async function addSchedule(schedulesStack, index, scheduleData) {
  var color = colors[0];
  try {
    if (index < colors.length) {
      color = colors[index];
    } else {
      throw error
    }
  } catch {
    color = colors[Math.floor(Math.random() * colors.length)];
  }
  
  let schedule = schedulesStack.addStack();
  schedule.url = await getWidgetTapTargetUrl(scheduleData.URL);
  
  let coloredLine = schedule.addStack();
  coloredLine.cornerRadius = 2;
  coloredLine.setPadding(4, 6, 4, 6);
  coloredLine.backgroundColor = scheduleData.HasPassed ? Color.gray() : new Color(color.background);
  coloredLine.size = new Size(4, config.widgetFamily == "large" ? 40 : Device.isPad() ? 35 : 32);
  
  let verticalStack = schedule.addStack();
  verticalStack.layoutVertically();
  verticalStack.setPadding(0, 5, 0, 0);
  
  let firstLine = verticalStack.addStack();
  let SubjectName = firstLine.addText(scheduleData.Name);
  SubjectName.font = Font.boldSystemFont(config.widgetFamily == "large" ? 12 : Device.isPad() ? 11 : 10);
  SubjectName.textColor = Color.dynamic(Color.black(), Color.white());;
  SubjectName.lineLimit = 1;

  let secondLine = verticalStack.addStack();
  let Time = secondLine.addText(scheduleData.Time);
  Time.font = new Font("Menlo-Regular", config.widgetFamily == "large" ? 10 : Device.isPad() ? 9 : 8);
  Time.textColor = Color.dynamic(new Color("#1c1c1e"), new Color("#eeeeee"));
  Time.lineLimit = 1;

  let thirdLine = verticalStack.addStack();
  let Location = thirdLine.addText(scheduleData.Location);
  Location.font = new Font("Menlo-Regular", config.widgetFamily == "large" ? 10 : Device.isPad() ? 9 : 8);
  Location.textColor = Color.dynamic(new Color("#1c1c1e"), new Color("#eeeeee"));
  Location.lineLimit = 1;

  // Spacer Between Subject Name And Badge
  firstLine.addSpacer()
  
  let badgeContainer = firstLine.addStack();
  let Badge = badgeContainer.addText(scheduleData.Period);
  Badge.font = Font.boldSystemFont(config.widgetFamily == "large" ? 10 : Device.isPad() ? 9 : 8); 
  Badge.textColor = Color.white();
  Badge.lineLimit = 1;
  Badge.rightAlignText();
  badgeContainer.backgroundColor = scheduleData.HasPassed ? Color.gray() : new Color (color.background);
  badgeContainer.setPadding(0, 6, 0, 6);
  badgeContainer.cornerRadius = 4;
}

async function addHeader(widget, text) {
  let header = widget.addStack();
  header.layoutVertically();
  header.topAlignContent();
  header.setPadding(0, 0, 5, 0);
  // Text
  let headerText = header.addText(text);
  headerText.textColor = Color.red();
  headerText.font = Font.semiboldSystemFont(config.widgetFamily == "large" ? 14 : 12);
}

async function addTwoSidedStack(main) {
  let leftStack = main.addStack();
  leftStack.spacing = 4;
  leftStack.layoutVertically();
  
  let rightStack = main.addStack();
  rightStack.spacing = 4;
  rightStack.layoutVertically();
  
  return {leftStack: leftStack, rightStack: rightStack}
}
  