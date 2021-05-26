import Card from '../helpers/card';

export default class waitForCards extends Phaser.Scene {
    constructor() {
        super({
            key: 'WaitForCards'
        });
    }

    init(data){
        /**   Game   **/
        this.gameId = data.gameId;
        this.socket = data.server;
        this.id = data.id;
        this.cardNumbers = data.cardNumbers;
        this.story = data.story;
        this.cardChoice = data.cardChoice;
        this.isStoryteller = data.isStoryteller;
    }

    preload() {
        /**   Cards   **/
        this.load.image('card_00', 'src/assets/card-0.png');
    }

    create() {
        /**   Game   **/
        let self = this;

        var style = { 
            fontSize: 34,
            fontFamily: 'Arial',
            align: "left",
            color: '#413b45',
            wordWrap: { width: 250, useAdvancedWrap: true }
        };

        this.add.text(750, 300, 'Wait for all players to choose a card for this story', style);
        this.add.text(750, 450, 'The story: ' + this.story, style).setFontSize(40);

        self.socket.emit("waiting", self.gameId);

        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < 2; i++) {
                let playerCard = new Card(self);
                if(j==0 && i==0)
                    playerCard.render(215 + (i * 225), 290 + 340 * j, this.cardChoice, true).setTint().setScale(1.8, 1.8);
                else
                    playerCard.render(240 + (i * 225), 360 + 300 * j, 'card_00', true).setTint().setScale(1, 1);
            }
        }

        this.socket.once('cardResults', function (cards) {
            if (self.scene.isActive("VoteScene")) { 
                self.scene.stop("VoteScene");
                self.scene.start("VoteScene", {gameId: self.gameId, server: self.socket, id: self.id, cardNumbers: cards, story: self.story, cardChoice: self.cardChoice, isStoryteller: self.isStoryteller});
            }
            else
                self.scene.start("VoteScene", {gameId: self.gameId, server: self.socket, id: self.id, cardNumbers: cards, story: self.story, cardChoice: self.cardChoice, isStoryteller: self.isStoryteller});
        });
    }

}