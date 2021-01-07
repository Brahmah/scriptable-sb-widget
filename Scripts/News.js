// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;

let newsItems = [
  {
    Title: "The PE Deopartment Has Laughed For 50 Hours",
    Author: "Tim Cook",
    DateTimePublished: "06/01/2021, 14:47",
    Image:
      "https://www.zocalopublicsquare.org/wp-content/uploads/2017/01/Mathews-col-Trump-LEAD.jpg",
    URL: "https://google.com",
  },
  {
    Title:
      "The Quick Brown Fox Jumped Over The Lazy Dog.  Jumped Over The Lazy DogJumped OvJumped Over The Lazy Doger The Lazy Dog.",
    Author: "Tim Cook",
    DateTimePublished: "06/01/2021, 14:47",
    Image:
      "https://ga1.imgix.net/screenshot/o/119343-schoolbox-1566448882-1962945?auto=format&q=50&fit=fill",
    URL: "https://google.com",
  },
  {
    Title: "We Have New Soccer Balls We Really Do! Trus Us!",
    Author: "Tim Cook",
    DateTimePublished: "06/01/2021, 14:47",
    Image: "",
    URL: "https://google.com",
  },
  {
    Title:
      "This one trick news companys don't want you to know. Tried Turning It Off And On Again?",
    Author: "Tim Cook",
    DateTimePublished: "06/01/2021, 14:47",
    Image: "https://miro.medium.com/max/450/1*sNnuIM29rLqCRUgKwyvYuA.jpeg",
    URL: "https://google.com",
  },
  {
    Title: "We Have New Soccer Balls",
    Author: "Tim Cook",
    DateTimePublished: "06/01/2021, 14:47",
    Image:
      "https://www.zocalopublicsquare.org/wp-content/uploads/2017/01/Mathews-col-Trump-LEAD.jpg",
    URL: "https://google.com",
  },
  {
    Title: "We Have New Soccer Balls",
    Author: "Tim Cook",
    DateTimePublished: "06/01/2021, 14:47",
    Image:
      "https://www.zocalopublicsquare.org/wp-content/uploads/2017/01/Mathews-col-Trump-LEAD.jpg",
    URL: "https://google.com",
  },
  {
    Title: "We Have New Soccer Balls",
    Author: "Tim Cook",
    DateTimePublished: "06/01/2021, 14:47",
    Image:
      "https://www.zocalopublicsquare.org/wp-content/uploads/2017/01/Mathews-col-Trump-LEAD.jpg",
    URL: "https://google.com",
  },
  {
    Title: "We Have New Soccer Balls",
    Author: "Tim Cook",
    DateTimePublished: "06/01/2021, 14:47",
    Image:
      "https://www.zocalopublicsquare.org/wp-content/uploads/2017/01/Mathews-col-Trump-LEAD.jpg",
    URL: "https://google.com",
  },
  {
    Title: "We Have New Soccer Balls",
    Author: "Tim Cook",
    DateTimePublished: "06/01/2021, 14:47",
    Image:
      "https://www.zocalopublicsquare.org/wp-content/uploads/2017/01/Mathews-col-Trump-LEAD.jpg",
    URL: "https://google.com",
  },
];

insert["/Dependencies/News/images.js"];
insert["/Dependencies/News/widget.js"];


if (args.queryParameters.url) {
  var wv = new WebView();
  wv.loadURL(args.queryParameters.url, null, true);
  wv.present(true);
} else {
  const widget = await createWidget();
  Script.setWidget(widget);
}

Script.complete();
