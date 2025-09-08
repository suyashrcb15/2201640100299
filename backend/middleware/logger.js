export default function requestLogger(req, res, next) {
  const start = Date.now();
  console.log(`[LOG] ${new Date().toISOString()} ${req.method} ${req.originalUrl} BODY=`, req.body || {});
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[LOG] ${req.method} ${req.originalUrl} -> ${res.statusCode} in ${ms}ms`);
  });
  next();
}
fr