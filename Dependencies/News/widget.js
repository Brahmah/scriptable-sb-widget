async function createWidget() {
  const widget = new ListWidget();

  // TITLE
  const titleStack = widget.addStack();
  titleStack.layoutHorizontally();

  const widgetTitle = titleStack.addText("News");
  widgetTitle.font = Font.heavySystemFont(16);
  widgetTitle.textColor = Color.dynamic(
  new Color("#000000"),
  new Color("#fefefe")
);
  widgetTitle.lineLimit = 1;
  widgetTitle.minimumScaleFactor = 0.5;

  // MAIN
  if (newsItems) {
    if (maximumInWidget != 1) {
      await createMultipleNewsWidget(widget);
    }
    if (maximumInWidget == 1) {
      await createSingleNewsWidget(widget);
    }
  } else {
    await generateErrorMsg(widget);
  }

  return widget;
}

async function generateErrorMsg(widget) {
  widget.addSpacer();
  const sadFace = widget.addText(":(");
  sadFace.font = Font.regularSystemFont(
    config.widgetFamily === "large" ? 190 : 60
  );
  sadFace.textColor = Color.white();
  sadFace.lineLimit = 1;
  sadFace.minimumScaleFactor = 0.1;

  widget.addSpacer();

  const errMsg = widget.addText("Couldn't load data");
  errMsg.font = Font.regularSystemFont(12);
  errMsg.textColor = Color.white();

  // Background
  widget.backgroundColor = new Color("#1f67b1");
}

async function createMultipleNewsWidget(widget) {
  widget.setPadding(16, 16, 16, 16);
  widget.spacing = 10;
  for (var i = 0; i < newsItems.length; i++) {
    if (i < maximumInWidget) {
      await addNewsItem(widget, newsItems[i]);
      if (i > maximumInWidget - 1 && config.widgetFamily == "large") {
        widget.addSpacer();
      }
    }
  }
  widget.backgroundColor = Color.dynamic(Color.white(), new Color("#1c1c1e"));
}

async function addNewsItem(widget, newsItem) {
  var StackRow = widget.addStack();
  StackRow.layoutHorizontally();
  StackRow.url = `scriptable:///run/${String(Script.name()).replace(
    " ",
    "%20"
  )}?url=${newsItem.URL}`;

  var StackCol = StackRow.addStack();
  StackCol.layoutVertically();

  var NewsDateTimeLabel = StackCol.addText(
    newsItem.Author + " - " + newsItem.DateTimePublished
  );
  NewsDateTimeLabel.font = Font.heavySystemFont(12);
  //NewsDateTimeLabel.textColor = CONF_FONT_COLOR_DATE;
  NewsDateTimeLabel.lineLimit = 1;
  NewsDateTimeLabel.minimumScaleFactor = 0.5;

  var NewsHeadlineLabel = StackCol.addText(newsItem.Title);
  NewsHeadlineLabel.font = Font.semiboldSystemFont(13);
  //NewsHeadlineLabel.textColor = CONF_FONT_COLOR_HEADLINE;
  NewsHeadlineLabel.lineLimit = 2;

  StackRow.addSpacer();

  let loadedImage = await loadImage(newsItem.Image);
  var NewsImage = StackRow.addImage(loadedImage.image);
  if (loadedImage.error) {
    NewsImage.tintColor = Color.gray();
  }

  if (config.widgetFamily == "large") {
    NewsImage.imageSize = new Size(63, 63);
    NewsHeadlineLabel.lineLimit = 3;
  } else {
    NewsImage.imageSize = new Size(45.66, 45.66);
  }
  NewsImage.cornerRadius = 8;
  if (config.widgetFamily == "small") {
    //NewsImage.tintColor = CONF_FONT_COLOR_HEADLINE;
    NewsImage.imageOpacity = 0.5;
  }
  NewsImage.rightAlignImage();
}

async function createSingleNewsWidget(widget) {
  // use default padding
  widget.useDefaultPadding();
  widget.addSpacer();
  widget.backgroundColor = Color.dynamic(Color.white(), new Color("#1c1c1e"));

  var ImageReq = new Request(newsItems[0].Image);
  var image = await ImageReq.loadImage();
  widget.backgroundImage = await image;

  const postStack = widget.addStack();
  postStack.layoutVertically();

  if (config.widgetFamily === "medium" || config.widgetFamily === "large") {
    const labelDateTime = postStack.addText(
      newsItems[0].Author + " - " + newsItems[0].DateTimePublished
    );
    labelDateTime.font = Font.heavySystemFont(12);
    labelDateTime.textColor = Color.dynamic(
      new Color("#8a8a8d"),
      new Color("#9f9fa4")
    );
    labelDateTime.lineLimit = 1;
    labelDateTime.minimumScaleFactor = 0.5;
  } else {
    const labelWidgetTitle = postStack.addText(newsItems[0].Author);
    labelWidgetTitle.font = Font.heavySystemFont(12);
    labelWidgetTitle.textColor = Color.dynamic(
      new Color("#8a8a8d"),
      new Color("#9f9fa4")
    );
    labelWidgetTitle.lineLimit = 1;
    labelWidgetTitle.minimumScaleFactor = 0.5;

    const labelDateTime = postStack.addText(newsItems[0].DateTimePublished);
    labelDateTime.font = Font.heavySystemFont(12);
    labelDateTime.textColor = Color.dynamic(
      new Color("#8a8a8d"),
      new Color("#9f9fa4")
    );
    labelDateTime.lineLimit = 1;
    labelDateTime.minimumScaleFactor = 0.5;
  }

  const labelHeadline = postStack.addText(newsItems[0].Title);
  labelHeadline.font = Font.semiboldSystemFont(13);
  labelHeadline.textColor = Color.dynamic(
    new Color("#000000"),
    new Color("#fefefe")
  );
  labelHeadline.lineLimit = 3;

  widget.url = newsItems[0].URL;
}
