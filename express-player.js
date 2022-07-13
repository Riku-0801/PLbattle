class player{

    cardDrawRequest(req,res,playerDb){
            const selectId = playerDb.findIndex(
              (e) => e.playerId === req.body.player_Id
            );
          
            if (req.body.carddata.length != 0) {
              playerDb[selectId].cardList = req.body.carddata;
            }
            card_draw(selectId);
            //フロントに新規リストを送信
          
            res.send(playerDb[selectId].cardList);
    }
    addPlayerData(res,numClients,playerDb){
            if (numClients[req.body.RoomId] == 1) {
              playerDb.push({
                RoomId: req.body.RoomId,
                playerId: req.body.player_Id,
                cardList: [],
                myHp: 200,
                enemyHp: 200,
                cardListNumber: [],
                turnFlag: 1,
              });
            } else {
              playerDb.push({
                RoomId: req.body.RoomId,
                playerId: req.body.player_Id,
                cardList: [],
                myHp: 200,
                enemyHp: 200,
                cardListNumber: [],
                turnFlag: 0,
              });
            }
            res.json(numClients[req.body.RoomId]);
    }

}
module.export = player;