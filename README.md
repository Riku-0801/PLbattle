# PLbattleの遊び方

## 対戦形態

1vs1

## 使用カード

- 言語カード 27 種類
  - 主に攻撃を行うカード。単体でも使用可能。他の言語カードやフレームワークカード、OS カードと組み合わせて使うこともできる。
- フレームワークカード 19 種類
  - 主に攻撃を行うカード。単体でも使用可能。他のフレームワークカードや言語カードと組み合わせて使うこともできる。
- アタッチメントカード 7 種類
  - 回復や強化を行うカード。単体でのみ使用可能。
- ハックカード 2 種類
  - 相手の HP を奪い、自分のものにすることができるカード。単体でのみ使用可能。

| type       | variation | action      | combo                    |
| ---------- | --------- | ----------- | ------------------------ |
| language   | 27        | attack      | language, framework, OS, |
| framework  | 19        | attack      | language, framework, OS  |
| attachment | 7         | enhancement | -                        |
| hack       | 2         | steal       | -                        |

language に対応した framework を用いると、攻撃力 1.5 倍

対応する OS フィールドの時、そのカードの攻撃力が２倍(未実装)

（1-2: macOS, 3-4: AndroidOS, 5-6: WindowsOS, 7-8: iOS, 9-10: linuxOS）

## 目的

相手の HP をゼロにする

## ルール

1. 各自手札を６枚ずつ用意する
２. 4 タイプのカードを組み合わせて戦う
2 人で交互にターンを繰り返す
２. 4 タイプのカードを組み合わせて戦う
5. 相手の HP をゼロにして勝つ


# frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
