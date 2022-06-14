import http from "http";

const server = http.createServer((req, res) => {
  res.end("hello");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
