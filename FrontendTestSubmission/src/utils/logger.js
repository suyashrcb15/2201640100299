const logger = {
  log: (msg, data)=> console.log(`[FE LOG ${new Date().toISOString()}] ${msg}`, data||'')
}
export default logger
