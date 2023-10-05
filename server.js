const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

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

// Địa chỉ máy chủ video (được proxy đến)
const videoTarget = "https://boc8.fun";

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

function handleProxyError(err, req, res) {
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });
  res.end(`Error occurred: ${err}`);
}

app.listen(port, "0.0.0.0", () => {
  console.log(`Proxy Server is running on port ${port}`);
});
