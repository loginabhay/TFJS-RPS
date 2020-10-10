var video = document.getElementById("videoInput");
var canvas = document.getElementById("videoCanvas");
var ctx = canvas.getContext("2d");
var model;
var modelParams = {
  flipHorizontal: true,   // flip e.g for video 
  imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
  maxNumBoxes: 20,        // maximum number of boxes to detect
  iouThreshold: 0.5,      // ioU threshold for non-max suppression
  scoreThreshold: 0.45,    // confidence threshold for predictions.
}


function startVideo(video) {
  // Video must have height and width in order to be used as input for NN
  // Aspect ratio of 3/4 is used to support safari browser.
  video.width = 640;
  video.height = 480;
  video.width = video.width || 400;
  video.height = video.height || video.width * (3 / 4);
  canvas.setAttribute("height", video.height);
  canvas.setAttribute("width", video.width);

  return new Promise(function (resolve, reject) {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true,
      })
      .then(stream => {
        window.localStream = stream;
        video.srcObject = stream
        video.onloadedmetadata = () => {
          video.play()
          resolve(true)
        }
      }).catch(function (err) {
        resolve(false)
      });
  });

}

async function stopVideo() {
  if (window.localStream) {
    window.localStream.getTracks().forEach((track) => {
      track.stop();
      return true;
    });
  } else {
    return false;
  }
}

async function RenderVideo(){
  model.detect(video).then(predictions => {
    model.renderPredictions(predictions, canvas, ctx, video)
    // console.log(predictions)
  });
}


function start(){
  RenderVideo();
  window.requestAnimationFrame(() => {
          setInterval(() => {
            RenderVideo();
          }, 1000 / 20);
        });
      }

window.startLoop = async () => {
        await startVideo(video);
        model = await handTrack.load(modelParams);
        console.log("Model loaded and warmed up!!")
        start();
      };