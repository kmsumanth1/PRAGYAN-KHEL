# AI Smart Lens 

**AI Smart Lens** is a web-based application that demonstrates how Artificial Intelligence can be used to process videos in real time. The system applies a background blur effect while keeping the main subject clear, similar to portrait mode in modern cameras.

Users can interact with videos in multiple ways — by uploading a video file, using a live camera feed, or loading a video through a URL. The project uses **MediaPipe Selfie Segmentation** to detect the human subject in each frame and apply the blur effect to the background.

---

##  Features

* Real-time **AI background blur**
* **Click-to-focus** interaction on the subject
* **Live camera processing**
* Ability to **upload and process videos**
* **FPS (Frames Per Second) display** to monitor performance
* Lightweight and fast implementation using **MediaPipe**
* **URL-based video tracking (currently under development)**

---

##  Technologies Used

This project was built using the following technologies:

* **JavaScript**
* **HTML5**
* **CSS3**
* **MediaPipe Selfie Segmentation**
* **HTML5 Canvas API**
* **WebRTC** for accessing the live camera

---

##  How the System Works

1. The user uploads a video, starts the live camera, or attempts to load a video using a URL.
2. Each frame of the video is processed by **MediaPipe Selfie Segmentation**, which detects the person in the frame.
3. The background of the video is blurred while the detected subject remains clear.
4. Users can click on the subject to enable focus mode.
5. The processed frames are rendered using the **HTML5 Canvas** for real-time display.

> **Note:** The URL-based video processing feature is currently under development and may not fully support all video sources yet.

---

##  Project Structure

```id="o6i0is"
AI-Smart-Lens
│
├── upload.html     (Upload video processing)
├── live.html       (Live camera processing)
├── url.html        (Video URL processing - under development)
├── style.css       (UI styling)
├── app.js          (Main AI and video processing logic)
└── README.md       (Project documentation)
```

---

## 🔮 Future Improvements

Future versions of this project may include:

* Full support for **URL-based video processing**
* **Multi-person selection**
* **Pose-based subject tracking**
* A more advanced **cinematic depth blur effect**
* Detection and tracking of **objects beyond humans**

---

## 👨‍💻 Author

This project was developed as part of an exploration into **AI-powered computer vision applications for the web**.
