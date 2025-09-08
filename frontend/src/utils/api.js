import axios from 'axios'
import logger from './logger.js'

const api = axios.create({ baseURL: 'http://localhost:5000/api' })

export async function createShortUrl(longUrl, shortcode, validity){
  logger.log('API createShortUrl called', { longUrl, shortcode, validity })
  const res = await api.post('/shorten', { longUrl, shortcode, validity })
  logger.log('API createShortUrl response', res.data)
  return res.data
}
export async function resolveShort(code){
  logger.log('API resolve called', { code })
  const res = await api.get(`/resolve/${code}`)
  return res.data
}
export async function getAllStats(){
  const res = await api.get('/stats')
  return res.data
}

export default api
