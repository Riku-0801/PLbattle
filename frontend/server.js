const express = require('express')
const serveStatic = require('serve-static')
const cors = require('cors')
const app = express()

const port = process.env.PORT || 3000


if (process.env.NODE_ENV !== 'production') {
	app.use(cors())
}

app.use(serveStatic(__dirname + '/dist'))


var data = [
    {
        id: 1,
        name: "python",
        type: "attack",
        img: "http://localhost:3000/data/photo001.jpg",
        action: "attack",
        value: "10"
    },{
        id: 2,
        name: "C",
        type: "C",
        img: "http://localhost:3000/data/photo002.jpg",
        action: "attack",
        value: "10"
    },{
        id: 3,
        name: "C++",
        type: "C++",
        img: "http://localhost:3000/data/photo002.jpg",
        action: "attack",
        value: "10"
    },{
        id: 4,
        name: "C#",
        type: "C#",
        img: "http://localhost:3000/data/photo002.jpg",
        action: "attack",
        value: "10"
    },{
        id: 5,
        name: "Ruby",
        type: "Ruby",
        img: "http://localhost:3000/data/photo002.jpg",
        action: "attack",
        value: "10"
    },{
        id: 6,
        name: "Rails",
        type: "Rails",
        img: "http://localhost:3000/data/photo002.jpg",
        action: "attack",
        value: "10"
    },{
        id: 7,
        name: "Javascript",
        type: "Javascript",
        img: "http://localhost:3000/data/photo002.jpg",
        action: "attack",
        value: "10"
    },{
        id: 8,
        name: "Java",
        type: "Java",
        img: "http://localhost:3000/data/photo002.jpg",
        action: "attack",
        value: "10"
    },{
        id: 9,
        name: "Vue",
        type: "Vue",
        img: "http://localhost:3000/data/photo002.jpg",
        action: "attack",
        value: "10"
    },{
        id: 10,
        name: "React",
        type: "React",
        img: "http://localhost:3000/data/photo002.jpg",
        action: "attack",
        value: "10"
    }
]
// 下記内容を追記
app.get('/api/message', (req, res) => {
	res.json(data)
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
