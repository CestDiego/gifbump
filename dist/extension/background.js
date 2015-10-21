function upload(file) {
  var id = String(Date.now())

  chrome.notifications.create(id, {
    type: 'progress',
    iconUrl: 'icon.png',
    title:  'Uploading GifBump!',
    message: "Uploading bump to our server in da cloud! (not imgur...)",
    progress: 0
  }, function (e) {
    console.log(e)
  })

  // file is from a <input> tag or from Drag'n Drop
  // Is the file an image?

  if (!file || !file.type.match(/image.*/)) return;

  // It is!
  // Let's build a FormData object

  var fd = new FormData();
  fd.append("image", file); // Append the file
  fd.append("key", "6528448c258cff474ca9701c5bab6927");
  // Get your own key: http://api.imgur.com/

  // Create the XHR (Cross-Domain XHR FTW!!!)
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://api.imgur.com/2/upload.json"); // Boooom!

  xhr.onload = function() {
    // Big win!
    // The URL of the image is:
    var link = JSON.parse(xhr.responseText).upload.links.original;
    // use our own domain for gifs
    link = link.replace('i.imgur.com', 'go.gifbu.mp')
    console.log(link);
    chrome.runtime.sendMessage({ action: 'sendLink', content: link });
    copyToClipboard(link)

    chrome.notifications.update(id, {
      type: 'basic',
      iconUrl: 'icon.png',
      title:  'GifBump Uploaded!',
      message: "Your GifBump is copied to the clipboard! Rad!\n" + link
    }, function (e) {console.log(e)})

    chrome.notifications.onClicked.addListener(function (e){window.open(link)})
  }

  xhr.upload.onload = function(){
    chrome.notifications.update(id, {
      type: 'basic',
      iconUrl: 'icon.png',
      title:  'Processing Bump...',
      message: "Waiting for \"our server\" to get the link..."
    }, function (e) {console.log(e)})
  }

  xhr.upload.onprogress = function(e){
    chrome.notifications.update(id, {
      progress: Math.round((e.loaded / e.total) * 100)
    })
  }

  // Ok, I don't handle the errors. An exercice for the reader.
  // And now, we send the formdata
  xhr.send(fd);
}

function blobToFile(theBlob, fileName){
  /* A Blob() is almost a File() - it's just missing the two properties below which we will add */
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

function copyToClipboard(text) {
  var input = document.createElement('input');
  input.style.position = 'fixed';
  input.style.opacity = 0;
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('Copy');
  document.body.removeChild(input);
}

chrome.runtime.onMessage.addListener(function (msg) {
  if (msg.action === 'uploadFile'){
    var blobURL = msg.content
    var xhr = new XMLHttpRequest();
    xhr.open('GET', blobURL, true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
      if (this.status == 200) {
        var myBlob = blobToFile(this.response, "holi.gif");
        upload(myBlob)
      }
    };
    xhr.send();
  }
})
