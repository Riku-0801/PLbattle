import axios from 'axios'

// baseURLの設定
const http = axios.create({
	baseURL: process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/api' : '/api',
})

export default http