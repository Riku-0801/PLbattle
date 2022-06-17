const express = require('express')
const serveStatic = require('serve-static')
const cors = require('cors')
const app = express()

const port = process.env.PORT || 3000


if (process.env.NODE_ENV !== 'production') {
	app.use(cors())
}

app.use(serveStatic(__dirname + '/dist'))

var combo_data = [
    {
        combo_id: 0,
        name_en: "Test combo",
        name_ja: "てすとだよ",
        action_value: 0,
        id_list: [1]
    },
    {
        combo_id: 1,
        name_en: "Royal Straight Flush",
        name_ja: "ロイヤルストレートフラッシュ",
        action_value: 500,
        id_list: [29,41,42,44]
    },{
        combo_id: 2,
        name_en: "Mark Up",
        name_ja: "マークアップ",
        action_value: 40,
        id_list: [2,3]
    },{
        combo_id: 3,
        name_en: "Rookie",
        name_ja: "ルーキー",
        action_value: 60,
        id_list: [1,2,3]
    },{
        combo_id: 4,
        name_en: "Jewelry",
        name_ja: "ジュエリー",
        action_value: 100,
        id_list: [28,29]
    },{
        combo_id: 5,
        name_en: "P_combo1",
        name_ja: "Pコンボ1",
        action_value: 80,
        id_list: [27,28]
    },{
        combo_id: 6,
        name_en: "P_combo2",
        name_ja: "Pコンボ2",
        action_value: 80,
        id_list: [10,27]
    },{
        combo_id: 7,
        name_en: "P_combo3",
        name_ja: "Pコンボ3",
        action_value: 80,
        id_list: [10,28]
    },{
        combo_id: 8,
        name_en: "P_Family",
        name_ja: "Pファミリー",
        action_value: 100,
        id_list: [10,27,28]
    },{
        combo_id: 9,
        name_en: "R_combo1",
        name_ja: "Rコンボ1",
        action_value: 50,
        id_list: [11,33]
    },{
        combo_id: 10,
        name_en: "R_combo2",
        name_ja: "Rコンボ2",
        action_value: 60,
        id_list: [11,39]
    },{
        combo_id: 11,
        name_en: "R_combo3",
        name_ja: "Rコンボ3",
        action_value: 80,
        id_list: [33,39]
    },{
        combo_id: 12,
        name_en: "R_Family",
        name_ja: "Rファミリー",
        action_value: 90,
        id_list: [11,33,39]
    },{
        combo_id: 13,
        name_en: "Chalk & Cheese",
        name_ja: "月と鼈",
        action_value: 60,
        id_list: [1,43]
    },{
        combo_id: 14,
        name_en: "The Script Brothers",
        name_ja: "スクリプト兄弟",
        action_value: 50,
        id_list: [1,12]
    },{
        combo_id: 15,
        name_en: "Bird",
        name_ja: "バード",
        action_value: 70,
        id_list: [30,31]
    },{
        combo_id: 16,
        name_en: "Google",
        name_ja: "グーグル",
        action_value: 80,
        id_list: [32,37]
    },{
        combo_id: 17,
        name_en: "Apple",
        name_ja: "アップル",
        action_value: 70,
        id_list: [29,30]
    },{
        combo_id: 18,
        name_en: "Pythons1",
        name_ja: "パイソンズ1",
        action_value: 40,
        id_list: [4,5]
    },{
        combo_id: 19,
        name_en: "Pythons2",
        name_ja: "パイソンズ2",
        action_value: 50,
        id_list: [4,16]
    },{
        combo_id: 20,
        name_en: "Pythons3",
        name_ja: "パイソンズ3",
        action_value: 50,
        id_list: [5,16]
    },{
        combo_id: 21,
        name_en: "The Python Brothers",
        name_ja: "パイソン兄弟",
        action_value: 70,
        id_list: [4,5,16]
    },{
        combo_id: 22,
        name_en: "Animals2",
        name_ja: "アニマルズ1",
        action_value: 80,
        id_list: [10,37]
    },{
        combo_id: 23,
        name_en: "Animals2",
        name_ja: "アニマルズ2",
        action_value: 70,
        id_list: [10,51]
    },{
        combo_id: 24,
        name_en: "Animals3",
        name_ja: "アニマルズ3",
        action_value: 80,
        id_list: [37,51]
    },{
        combo_id: 25,
        name_en: "Japanese",
        name_ja: "ジャパニーズ",
        action_value: 90,
        id_list: [50,51,52]
    }
]

var data = [
    {
        id: 1,
        name: "Javascript",
        type: "language",
        img: "",
        action: "attack",
        value: 10,
        field: "",
        set_id: 0
    },{
        id: 1,
        name: "Javascript",
        type: "language",
        img: "",
        action: "attack",
        value: 10,
        field: "",
        set_id: 0
    },{
        id: 1,
        name: "Javascript",
        type: "language",
        img: "",
        action: "attack",
        value: 10,
        field: "",
        set_id: 0
    },{
        id: 2,
        name: "HTML",
        type: "language",
        img: "",
        action: "attack",
        value: 10,
        field: "",
        set_id: 0
    },{
        id: 3,
        name: "CSS",
        type: "language",
        img: "",
        action: "attack",
        value: 10,
        field: "",
        set_id: 0
    },{
        id: 4,
        name: "Django",
        type: "framework",
        img: "",
        action: "attack",
        value: 20,
        field: "LinuxOS",
        set_id: 10
    },{
        id: 5,
        name: "FastAPI",
        type: "framework",
        img: "",
        action: "attack",
        value: 10,
        field: "LinuxOS",
        set_id: 10
    },{
        id: 6,
        name: "jQuery",
        type: "framework",
        img: "",
        action: "attack",
        value: 10,
        field: "",
        set_id: 10
    },{
        id: 7,
        name: "Ktor",
        type: "framework",
        img: "",
        action: "attack",
        value: 20,
        field: "AndroidOS",
        set_id: 31
    },{
        id: 8,
        name: "Cake PHP",
        type: "framework",
        img: "",
        action: "attack",
        value: 20,
        field: "",
        set_id: 27
    },{
        id: 9,
        name: "SwiftUI",
        type: "framework",
        img: "",
        action: "attack",
        value: 20,
        field: "iOS,macOS",
        set_id: 30
    },{
        id: 10,
        name: "Python",
        type: "language",
        img: "",
        action: "attack",
        value: 30,
        field: "LinuxOS",
        set_id: 0
    },{
        id: 10,
        name: "Python",
        type: "language",
        img: "",
        action: "attack",
        value: 30,
        field: "LinuxOS",
        set_id: 0
    },{
        id: 10,
        name: "Python",
        type: "language",
        img: "",
        action: "attack",
        value: 30,
        field: "LinuxOS",
        set_id: 0
    },{
        id: 11,
        name: "R",
        type: "language",
        img: "",
        action: "attack",
        value: 20,
        field: "",
        set_id: 0
    },{
        id: 12,
        name: "TypeScript",
        type: "language",
        img: "",
        action: "attack",
        value: 30,
        field: "",
        set_id: 0
    },{
        id: 13,
        name: "Julia",
        type: "language",
        img: "",
        action: "attack",
        value: 20,
        field: "",
        set_id: 0 
    },{
        id: 14,
        name: "warp",
        type: "framework",
        img: "",
        action: "attack",
        value: 20,
        field: "",
        set_id: 33
    },{
        id: 15,
        name: "Vue",
        type: "framework",
        img: "",
        action: "attack",
        value: 20,
        field: "",
        set_id: 1
    },{
        id: 16,
        name: "Flask",
        type: "framework",
        img: "",
        action: "attack",
        value: 20,
        field: "LinuxOS",
        set_id: 10
    },{
        id: 17,
        name: "Rails",
        type: "framework",
        img: "",
        action: "attack",
        value: 30,
        field: "",
        set_id: 39
    },{
        id: 18,
        name: "Angular",
        type: "framework",
        img: "",
        action: "attack",
        value: 20,
        field: "",
        set_id: 1
    },{
        id: 19,
        name: "Spring",
        type: "framework",
        img: "",
        action: "attack",
        value: 20,
        field: "",
        set_id: 43
    },{
        id: 20,
        name: "echo",
        type: "framework",
        img: "",
        action: "attack",
        value: 20,
        field: "",
        set_id: 37
    },{
        id: 21,
        name: "Rocket",
        type: "framework",
        img: "",
        action: "attack",
        value: 20,
        field: "",
        set_id: 33
    },{
        id: 22,
        name: "Yew",
        type: "framework",
        img: "",
        action: "attack",
        value: 20,
        field: "",
        set_id: 33
    },{
        id: 23,
        name: "Laravel",
        type: "framework",
        img: "",
        action: "attack",
        value: 30,
        field: "",
        set_id: 27
    },{
        id: 24,
        name: "Flutter",
        type: "framework",
        img: "",
        action: "attack",
        value: 30,
        field: "",
        set_id: 32
    },{
        id: 25,
        name: "外付けHDD",
        type: "attachment",
        img: "",
        action: "enhancement",
        value: 20,
        field: "",
        set_id: 0
    },{
        id: 26,
        name: "外付けHDD",
        type: "attachment",
        img: "",
        action: "enhancement",
        value: 20,
        field: "",
        set_id: 0
    },{
        id: 27,
        name: "PHP",
        type: "language",
        img: "",
        action: "attack",
        value: 30,
        field: "",
        set_id: 0
    },{
        id: 28,
        name: "Perl",
        type: "language",
        img: "",
        action: "attack",
        value: 40,
        field: "",
        set_id: 0
    },{
        id: 29,
        name: "Objective-C",
        type: "language",
        img: "",
        action: "attack",
        value: 30,
        field: "iOS,macOS",
        set_id: 0
    },{
        id: 30,
        name: "Swift",
        type: "language",
        img: "",
        action: "attack",
        value: 30,
        field: "iOS,macOS",
        set_id: 0
    },{
        id: 31,
        name: "Kotlin",
        type: "language",
        img: "",
        action: "attack",
        value: 30,
        field: "AndroidOS",
        set_id: 0
    },{
        id: 32,
        name: "dart",
        type: "language",
        img: "",
        action: "attack",
        value: 30,
        field: "",
        set_id: 0
    },{
        id: 33,
        name: "Rust",
        type: "language",
        img: "",
        action: "attack",
        value: 30,
        field: "",
        set_id: 0
    },{
        id: 34,
        name: "tailwind",
        type: "framework",
        img: "",
        action: "attack",
        value: 30,
        field: "",
        set_id: 3
    },{
        id: 35,
        name: "冷却ファン",
        type: "attachment",
        img: "",
        action: "enhancement",
        value: 30,
        field: "",
        set_id: 0
    },{
        id: 36,
        name: "Node.js",
        type: "framework",
        img: "",
        action: "attack",
        value: 40,
        field: "WindowsOS",
        set_id: 1
    },{
        id: 37,
        name: "Go",
        type: "language",
        img: "",
        action: "attack",
        value: 40,
        field: "",
        set_id: 0
    },{
        id: 38,
        name: "Haskell",
        type: "language",
        img: "",
        action: "attack",
        value: 40,
        field: "",
        set_id: 0
    },{
        id: 39,
        name: "Ruby",
        type: "language",
        img: "",
        action: "attack",
        value: 40,
        field: "",
        set_id: 0
    },{
        id: 40,
        name: "外付けSSD",
        type: "attachment",
        img: "",
        action: "enhancement",
        value: 40,
        field: "",
        set_id: 0
    },{
        id: 41,
        name: "C",
        type: "language",
        img: "",
        action: "attack",
        value: 50,
        field: "",
        set_id: 0
    },{
        id: 42,
        name: "C#",
        type: "language",
        img: "",
        action: "attack",
        value: 50,
        field: "",
        set_id: 0
    },{
        id: 43,
        name: "Java",
        type: "language",
        img: "",
        action: "attack",
        value: 50,
        field: "",
        set_id: 0
    },{
        id: 44,
        name: "C++",
        type: "language",
        img: "",
        action: "attack",
        value: 60,
        field: "",
        set_id: 0
    },{
        id: 45,
        name: "cobol",
        type: "language",
        img: "",
        action: "attack",
        value: 70,
        field: "",
        set_id: 0
    },{
        id: 46,
        name: "fortran",
        type: "language",
        img: "",
        action: "attack",
        value: 80,
        field: "",
        set_id: 0
    },{
        id: 47,
        name: "セカンドディスプレイ",
        type: "attachment",
        img: "",
        action: "enhancement",
        value: 30,
        field: "",
        set_id: 0
    },{
        id: 48,
        name: "キーボード",
        type: "attachment",
        img: "",
        action: "enhancement",
        value: 30,
        field: "",
        set_id: 0
    },{
        id: 49,
        name: "マウス",
        type: "attachment",
        img: "",
        action: "enhancement",
        value: 10,
        field: "",
        set_id: 0
    },{
        id: 50,
        name: "なでしこ",
        type: "language",
        img: "",
        action: "attack",
        value: 30,
        field: "",
        set_id: 0
    },{
        id: 51,
        name: "ドリトル",
        type: "language",
        img: "",
        action: "attack",
        value: 30,
        field: "",
        set_id: 0
    },{
        id: 52,
        name: "プロデル",
        type: "language",
        img: "",
        action: "attack",
        value: 30,
        field: "",
        set_id: 0
    },{
        id: 53,
        name: "Scratch",
        type: "language",
        img: "",
        action: "attack",
        value: 20,
        field: "",
        set_id: 0
    },{
        id: 54,
        name: "Hacker",
        type: "hack",
        img: "",
        action: "steal",
        value: 30,
        field: "",
        set_id: 0
    },{
        id: 55,
        name: "Hacker",
        type: "hack",
        img: "",
        action: "steal",
        value: 30,
        field: "",
        set_id: 0
    },{
        id: 56,
        name: "BootStrap",
        type: "framework",
        img : "",
        action: "attack",
        value: 20,
        field: "",
        set_id: 3
    }
]
// 下記内容を追記
app.get('/api/data', (req, res) => {
	res.json(data)
})
app.get('/api/combo_data', (req, res) => {
	res.json(combo_data)
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
