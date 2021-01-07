let timetableData = {
  NextRefreshTime: "2020-01-01T10:33",
  Days: [
    {
      Name: "Monday",
      IsCurrentDay: false,
      Schedules: [
        {
          Name: "Humanities",
          Time: "8:55 - 10:45",
          Location: "C3",
          Period: "P1",
          HasPassed: true,
        },
        {
          Name: "English",
          Time: "10:45 - 11:45",
          Location: "A1",
          Period: "P2",
          HasPassed: true,
        },
        {
          Name: "General Science",
          Time: "12:55 - 1:45",
          Location: "C3",
          Period: "P3",
          HasPassed: false,
        },
        {
          Name: "Mathamatics",
          Time: "8:55 - 10:45",
          Location: "C6",
          Period: "P4",
          HasPassed: false,
        },
        {
          Name: "Languages French",
          Time: "8:55 - 10:45",
          Location: "C2",
          Period: "P5",
          HasPassed: false,
        },
        {
          Name: "Other Made-Up Class",
          Time: "8:55 - 10:45",
          Location: "C3",
          Period: "P6",
          HasPassed: false,
        },
      ],
    },
    {
      Name: "Tuesday",
      IsCurrentDay: true,
      Schedules: [
        {
          Name: "Humanities",
          Time: "8:55 - 10:45",
          Location: "C3",
          Period: "P1",
          HasPassed: true,
        },
        {
          Name: "English",
          Time: "10:45 - 11:45",
          Location: "A1",
          Period: "P2",
          HasPassed: true,
        },
        {
          Name: "General Science",
          Time: "12:55 - 1:45",
          Location: "C3",
          Period: "P3",
          HasPassed: false,
        },
        {
          Name: "Mathamatics",
          Time: "8:55 - 10:45",
          Location: "C6",
          Period: "P4",
          HasPassed: false,
        },
        {
          Name: "Languages French",
          Time: "8:55 - 10:45",
          Location: "C2",
          Period: "P5",
          HasPassed: false,
        },
        {
          Name: "Other Made-Up Class",
          Time: "8:55 - 10:45",
          Location: "C3",
          Period: "P6",
          HasPassed: false,
        },
      ],
    },
    {
      Name: "Wednesday",
      IsCurrentDay: false,
      Schedules: [
        {
          Name: "English",
          Time: "8:55 - 10:45",
          Location: "C3",
          Period: "P1",
          HasPassed: true,
        },
        {
          Name: "Mathamatics",
          Time: "10:45 - 11:45",
          Location: "A1",
          Period: "P2",
          HasPassed: true,
        },
        {
          Name: "General Science",
          Time: "12:55 - 1:45",
          Location: "C3",
          Period: "P3",
          HasPassed: false,
        },
        {
          Name: "Mathamatics",
          Time: "8:55 - 10:45",
          Location: "C6",
          Period: "P4",
          HasPassed: false,
        },
        {
          Name: "Languages French",
          Time: "8:55 - 10:45",
          Location: "C2",
          Period: "P5",
          HasPassed: false,
        },
        {
          Name: "Other Made-Up Class",
          Time: "8:55 - 10:45",
          Location: "C3",
          Period: "P6",
          HasPassed: false,
        },
      ],
    },

    {
      Name: "Thursday",
      IsCurrentDay: false,
      Schedules: [
        {
          Name: "English",
          Time: "8:55 - 10:45",
          Location: "C3",
          Period: "P1",
          HasPassed: true,
        },
        {
          Name: "Mathamatics",
          Time: "10:45 - 11:45",
          Location: "A1",
          Period: "P2",
          HasPassed: true,
        },
        {
          Name: "General Science",
          Time: "12:55 - 1:45",
          Location: "C3",
          Period: "P3",
          HasPassed: false,
        },
        {
          Name: "Mathamatics",
          Time: "8:55 - 10:45",
          Location: "C6",
          Period: "P4",
          HasPassed: false,
        },
        {
          Name: "Languages French",
          Time: "8:55 - 10:45",
          Location: "C2",
          Period: "P5",
          HasPassed: false,
        },
        {
          Name: "Other Made-Up Class",
          Time: "8:55 - 10:45",
          Location: "C3",
          Period: "P6",
          HasPassed: false,
        },
      ],
    },

    {
      Name: "Friday",
      IsCurrentDay: false,
      Schedules: [
        {
          Name: "English",
          Time: "8:55 - 10:45",
          Location: "C3",
          Period: "P1",
          HasPassed: true,
        },
        {
          Name: "Mathamatics",
          Time: "10:45 - 11:45",
          Location: "A1",
          Period: "P2",
          HasPassed: true,
        },
        {
          Name: "General Science",
          Time: "12:55 - 1:45",
          Location: "C3",
          Period: "P3",
          HasPassed: false,
        },
        {
          Name: "Mathamatics",
          Time: "8:55 - 10:45",
          Location: "C6",
          Period: "P4",
          HasPassed: false,
        },
        {
          Name: "Languages French",
          Time: "8:55 - 10:45",
          Location: "C2",
          Period: "P5",
          HasPassed: false,
        },
        {
          Name: "Other Made-Up Class",
          Time: "8:55 - 10:45",
          Location: "C3",
          Period: "P6",
          HasPassed: false,
        },
      ],
    },
  ],
};

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
