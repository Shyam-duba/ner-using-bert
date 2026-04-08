import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 120000, // 2 min – models can be slow on first load
})

export const fetchModels = () => api.get('/models').then(r => r.data)

export const extractFromUrl = (url) =>
  api.post('/extract-text', { url }).then(r => r.data)

export const extractFromFile = (file) => {
  const fd = new FormData()
  fd.append('file', file)
  return api.post('/extract-text', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data)
}

export const analyzeText = (text, models) =>
  api.post('/analyze', { text, models }).then(r => r.data)

export const healthCheck = () => api.get('/health').then(r => r.data)
