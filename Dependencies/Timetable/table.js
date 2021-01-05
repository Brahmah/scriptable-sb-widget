function generateTable() {
  let table = new UITable();
  for (var i = 0; i < timetable.currentDay.Schedules.length; i++) {
    var schedule = timetable.currentDay.Schedules[i];
    let row = new UITableRow();
    let titleCell = row.addText(schedule.Name);
    imageCell.widthWeight = 20;
    titleCell.widthWeight = 80;
    row.height = 60;
    row.cellSpacing = 10;
    row.onSelect = (idx) => {
      Safari.open("https://google.com");
    };
    row.dismissOnSelect = false;
    table.addRow(row);
  }

  return table;
}
