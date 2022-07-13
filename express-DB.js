const card_db = require("./DB").card_db;

class DB{

    getHp(req,res,playerDb){
            let selectId = playerDb.findIndex(
              (e) => e.playerId === req.body.player_Id
            );
          
            playerDb[selectId].myHp = req.body.HPs.mine;
            playerDb[selectId].enemyHp = req.body.HPs.yours;
            HP_data = {
              my_HP: playerDb[selectId].myHp,
              enemy_HP: playerDb[selectId].enemyHp,
            };
            res.send(HP_data);     
    }
    getHpOnReload(req,res,playerDb){
            let selectId = playerDb.findIndex(
              (e) => e.playerId === req.body.player_Id
            );
            HP_data = {
              my_HP: playerDb[selectId].myHp,
              enemy_HP: playerDb[selectId].enemyHp,
            };
            res.send(HP_data);
    }
    getComboDb(res,combo_data_db){
            res.json(combo_data_db);
    }
    getTurnOnReload(req,res,numClients,playerDb){
            const selectId = playerDb.findIndex(
              (e) => e.playerId === req.body.player_Id
            );
            sendData = {turnFlag: playerDb[selectId].turnFlag,
                        roomMember: numClients[req.body.roomId]}
            res.json(sendData);
            //覚え書き：数字を送る際はjsonにしよう。
    }
    getControlTurn(req,res,playerDb){
            //同じRoomにいる、自分以外の人のturn_flagを+１する
            const selectId = playerDb.findIndex(
              (e) => e.playerId === req.body.player_Id
            );
            const thisRoomId = playerDb[selectId].RoomId;
            const thisRoomPlayer = playerDb.filter((e) => {
              if (e.RoomId === thisRoomId && e.playerId != req.body.player_Id) {
                return true;
              }
            });
            //同じRoomにいる、自分以外の人のturn_flagを+１する
          
            const selectMyId = playerDb.findIndex(
              (e) => e.playerId === thisRoomPlayer[0].playerId
            );
            playerDb[selectMyId].turnFlag += 1;
            //自分のturn_flagを+１する
            playerDb[selectMyId].turnFlag += 1;
            res.send();
    }
    card_draw(selectId,playerDb) {
        console.log("ドロー関数が発火されました");
        for (let j = playerDb[selectId].cardList.length; j < 6; ) {
          const tmp = Number(Math.floor(Math.random() * 56));
          playerDb[selectId].cardList.push(card_db[tmp]);
          j++;
        }
    }

}

module.export = DB;