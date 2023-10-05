const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const btoa = require("btoa-lite");

const app = express();
const port = process.env.PORT || 5000;

// Middleware xử lý CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Địa chỉ máy chủ backend API của bạn (GitHub không phải là máy chủ backend)
const backendTarget = "https://backend-litestream-w688-pro.vercel.app/"; // Thay đổi thành địa chỉ thực tế của bạn

// Địa chỉ máy chủ video (được proxy đến)
const videoTarget = "https://boc8.fun";

// Middleware proxy cho định tuyến "/api" tới máy chủ backend API
const apiProxy = createProxyMiddleware("/api", {
  target: backendTarget,
  changeOrigin: true,
});

app.use("/api", apiProxy);

// Middleware proxy cho định tuyến "/getVideo" để ẩn địa chỉ URL
const videoProxy = createProxyMiddleware("/getVideo", {
  target: videoTarget,
  changeOrigin: true,
  pathRewrite: {
    "^/getVideo": "/kubet", // Thay đổi '/getVideo' thành '/kubet'
  },
  onError: handleProxyError, // Sự kiện lỗi cho proxy video
});

app.use("/getVideo", videoProxy);

// Endpoint để lấy URL video được mã hóa
app.get("/getEncodedURL", (req, res) => {
  const videoURL = `${backendTarget}/getVideo?v=1696501051387`;
  const encodedURL = btoa(videoURL);
  res.header("Content-Type", "text/plain");
  res.send(encodedURL);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Proxy Server is running on port ${port}`);
});
