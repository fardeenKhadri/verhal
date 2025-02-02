# HIRO - Healthcare Assisted by Intelligent Realtime Operator

HIRO is an advanced healthcare assistant that integrates **AI-powered video analysis** and **real-time health monitoring** using an **ESP8266 D1 Mini** to track heart rate. The system enables intelligent interactions and insights for enhanced healthcare assistance.

## 🚀 Features

- **Multi-Source Video Input:** Choose from **Webcam, Screen Capture, or ESP32-CAM**.
- **AI-Powered Video Analysis:** Engages in a conversation with an AI model to analyze the video feed.
- **Real-Time Heart Rate Monitoring:** Receives heart rate data from an **ESP8266 D1 Mini**.
- **Health Assistance:** Uses heart rate data to provide intelligent health recommendations.

## 🏗️ Tech Stack

- **Frontend:** React, TailwindCSS, Framer Motion
- **AI Model Integration:** Multimodal Vision LLMs like Moondream and Gimini for real-time video analysis
- **Hardware Integration:** ESP8266 D1 Mini for heart rate monitoring

## 📷 Video Input Sources

HIRO supports three different video input options:

1. **Webcam** (via `navigator.mediaDevices.getUserMedia`)
2. **Screen Capture** (via `navigator.mediaDevices.getDisplayMedia`)
3. **ESP32-CAM Stream** (via `http://<ESP32-IP>/stream`)

## 💖 Heart Rate Monitoring

- Heart rate data is received over WiFi from an **ESP8266 D1 Mini**.
- The system processes real-time heart rate changes to provide **health alerts and insights**.

## 🏥 Use Cases

- **Elderly Care:** Monitor heart rate and detect health anomalies.
- **Home Healthcare:** AI-assisted video guidance for self-care routines.
- **Telemedicine Support:** Helps in remote patient monitoring and diagnosis.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a Pull Request 🚀

## 📜 License

MIT License © 2025 HIRO Team

---

Made with ❤️ by **SEA-KERS**
