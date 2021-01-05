async function generateTable() {
  let table = new UITable();
  // Create Row For Text [Today]
  let row = new UITableRow();
  row.height = 60;
  row.cellSpacing = 10;
  row.dismissOnSelect = false;
  row.isHeader = true;
  // Add Cell
  let titleCell = row.addText("Today");
  titleCell.widthWeight = 80;
  // Add Row
  table.addRow(row);

  // ForEach Schedule
  for (var i = 0; i < timetable.currentDay.Schedules.length; i++) {
    var schedule = timetable.currentDay.Schedules[i];
    var row = await createTableSchedule(schedule);
    // Add Row
    table.addRow(row);
  }

  return table;
}

async function createTableSchedule(schedule) {
  // Assign Color
  var color = getColor();
  // Create Row
  let row = new UITableRow();
  row.backgroundColor = new Color(color.background);
  row.height = 60;
  row.cellSpacing = 10;
  row.onSelect = (idx) => {
    Safari.open("https://google.com");
  };
  row.dismissOnSelect = false;
  // Add Cells
  let titleCell = row.addText(schedule.Name);
  titleCell.widthWeight = 80;
  //
  return row;
}

function getColor() {
  var color = colors[0];
  try {
    if (index < colors.length) {
      color = colors[index];
    } else {
      throw error;
    }
  } catch {
    color = colors[Math.floor(Math.random() * colors.length)];
  }
  return color;
}
