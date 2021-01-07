async function loadImage(URL) {
    var image;
    var error = false;
    try {
      var req = new Request(URL);
      image = await req.loadImage();
      image = await resizeImage(image, 200);
      image = await cropImageToSquare(image);
    } catch {
      const sym = SFSymbol.named("square.slash");
      sym.applyFont(Font.regularSystemFont(60));
      image = sym.image;
      error = true;
    }
    return { image: image, error: error };
  }
  
  // Resize the background image
  async function resizeImage(img, maxShortSide) {
    let imgHeight = await img.size.height;
    let imgWidth = await img.size.width;
    let imgShortSide = Math.min(imgHeight, imgWidth);
    let resizeFactor = Math.round(imgShortSide / maxShortSide / 1);
  
    const js = `
      // Set up the canvas
      const img = document.getElementById("resImg");
      const canvas = document.getElementById("mainCanvas");
      const w = img.width;
      const h = img.height;
      const maxW = Math.round(w / ${resizeFactor} / 1);
      const maxH = Math.round(h / ${resizeFactor} / 1);
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      canvas.width = maxW;
      canvas.height = maxH;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, w, h);
      context.drawImage(img, 0, 0, maxW, maxH);
      
      // Get the image data from the context
      var imageData = context.getImageData(0,0,w,h);
      // Draw over the old image
      context.putImageData(imageData,0,0);
      // Return a base64 representation
      canvas.toDataURL();
    `;
  
    // Convert the images and create the HTML
    let resImgData = await Data.fromPNG(img).toBase64String();
    let html = `<img id="resImg" src="data:image/png;base64,${resImgData}" /><canvas id="mainCanvas" />`;
  
    // Make the web view and get its return value
    let view = await new WebView();
    await view.loadHTML(html);
    let returnValue = await view.evaluateJavaScript(js);
  
    // Remove the data type from the string and convert to data
    let imageDataString = await returnValue.slice(22);
    let imageData = await Data.fromBase64String(imageDataString);
  
    // Convert to image before returning
    let imageFromData = await Image.fromData(imageData);
  
    return imageFromData;
  }
  
  // Crop an image to a square
  async function cropImageToSquare(img) {
    const imgHeight = await img.size.height;
    const imgWidth = await img.size.width;
  
    let imgShortSide = Math.min(imgHeight, imgWidth);
    let imgLongSide = Math.max(imgHeight, imgWidth);
  
    if (imgShortSide != imgLongSide) {
      let imgCropTotal = imgLongSide - imgShortSide;
      let imgCropSide = Math.floor(imgCropTotal / 2 / 1);
  
      let rect;
      switch (imgShortSide) {
        case imgHeight:
          rect = await new Rect(imgCropSide, 0, imgShortSide, imgShortSide);
          break;
        case imgWidth:
          rect = await new Rect(0, imgCropSide, imgShortSide, imgShortSide);
          break;
      }
  
      let draw = await new DrawContext();
      draw.size = await new Size(rect.width, rect.height);
  
      await draw.drawImageAtPoint(img, new Point(-rect.x, -rect.y));
      img = await draw.getImage();
    }
    return img;
  }