const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const uploadInput = document.getElementById("videoUpload");
const fpsDisplay = document.getElementById("fps");

/* ==============================
   CUSTOM CONTROLS
============================== */

const playBtn = document.getElementById("playPause");
const seekBar = document.getElementById("seekBar");
const timeDisplay = document.getElementById("timeDisplay");

if (playBtn) {

  playBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      playBtn.innerText = "Pause";
    } else {
      video.pause();
      playBtn.innerText = "Play";
    }
  });

  video.addEventListener("loadedmetadata", () => {
    if (seekBar) seekBar.max = video.duration;
  });

  video.addEventListener("timeupdate", () => {
    if (!seekBar || !timeDisplay) return;

    seekBar.value = video.currentTime;
    const current = formatTime(video.currentTime);
    const total = formatTime(video.duration);

    timeDisplay.innerText = `${current} / ${total}`;
  });

  if (seekBar) {
    seekBar.addEventListener("input", () => {
      video.currentTime = seekBar.value;
    });
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

/* ==============================
   VIDEO UPLOAD
============================== */

if (uploadInput) {

  uploadInput.addEventListener("change", (e) => {

    const file = e.target.files[0];
    if (!file) return;

    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }

    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      setupCanvas();
      video.play();
    };
  });
}

/* ==============================
   AI VARIABLES
============================== */

let segmentation;
let isProcessing = false;
let lastMask = null;
let focusEnabled = false;

let frames = 0;
let lastTime = performance.now();

/* ==============================
   CLICK TO ENABLE FOCUS
============================== */

canvas.addEventListener("click", (e) => {

  if (!lastMask) return;

  const rect = canvas.getBoundingClientRect();

  const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
  const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  const tempCtx = tempCanvas.getContext("2d");

  tempCtx.drawImage(lastMask, 0, 0, canvas.width, canvas.height);

  const pixel = tempCtx.getImageData(x, y, 1, 1).data;

  if (pixel[0] > 128) {
    focusEnabled = true;

    if (video.paused) {
      video.play();
    }
  }
});

/* ==============================
   LOAD MODEL
============================== */

async function loadModel() {

  segmentation = new SelfieSegmentation({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
  });

  segmentation.setOptions({
    modelSelection: 1
  });

  segmentation.onResults(onResults);

  console.log("Smart Lens Ready 🚀");
}

/* ==============================
   SEGMENTATION RESULTS
============================== */

function onResults(results) {

  lastMask = results.segmentationMask;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Blur entire frame first
  ctx.save();
  ctx.filter = "blur(25px)";
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  if (focusEnabled) {

    // Cut person area from blur
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Draw sharp person
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  updateFPS();
  isProcessing = false;
}

/* ==============================
   RENDER LOOP
============================== */

function render() {

  if (
    video &&
    video.readyState === 4 &&
    !video.ended &&
    !isProcessing
  ) {
    isProcessing = true;
    segmentation.send({ image: video });
  }

  requestAnimationFrame(render);
}

/* ==============================
   START CAMERA
============================== */

async function startCamera() {

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: { ideal: 960 },
      height: { ideal: 540 },
      frameRate: { ideal: 30 }
    }
  });

  video.srcObject = stream;

  video.onloadedmetadata = () => {
    setupCanvas();
    video.play();
  };
}

/* ==============================
   CANVAS SETUP
============================== */

function setupCanvas() {

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.style.width = video.clientWidth + "px";
  canvas.style.height = video.clientHeight + "px";
}

/* ==============================
   FPS COUNTER
============================== */

function updateFPS() {

  frames++;

  const now = performance.now();

  if (now - lastTime >= 1000) {

    if (fpsDisplay) fpsDisplay.innerText = "FPS: " + frames;

    frames = 0;
    lastTime = now;
  }
}

/* ==============================
   INIT
============================== */

async function init() {

  await loadModel();

  if (window.location.pathname.includes("live.html")) {
    await startCamera();

    // hide raw camera feed
    video.style.position = "absolute";
    video.style.opacity = "0";
  }

  render();
}

init();