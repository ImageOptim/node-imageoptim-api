# ImageOptim MozJPEG HTTP API client

A Node interface for https://imageoptim.com/mozjpeg/ compressor.

It (re)compresses local PNG and JPEG files using MozJPEG encoder without needing any binaries installed on the local machine.

```js
const ImageOptim = require('imageoptim-api');

const im = new ImageOptim();

im.compress()
    .file('source_image.png')
    .save('dest_image.jpg')
    .then(() => {
        console.log("Done! ./dest_image.jpg has been written");
    });
```
