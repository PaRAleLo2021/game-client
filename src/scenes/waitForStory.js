import io from 'socket.io-client';
import Dealer from "../helpers/dealer";

export default class waitForStory extends Phaser.Scene {
    constructor() {
        super({
            key: 'WaitForStory'
        });
    }

    init(data){
        /**   Chat   **/
        this.socket_chat = io("http://localhost:4000", { 
            autoConnect: false });
        this.chatMessages = [];

        /**   Game   **/
        this.gameId = data.gameId;
        this.socket = data.server;
        this.id = data.id;
        this.cardNumbers = [];


        this.cards = [];
    }

    preload() {
        /**   Chat   **/
        this.load.html("form", "src/assets/form.html");

        /**   Cards   **/
        this.load.image('card_00', 'src/assets/card-0.png');
        this.load.image('card_01', 'src/assets/card-1.png');
        this.load.image('card_02', 'src/assets/card-2.png');
        this.load.image('card_03', 'src/assets/card-3.png');
        this.load.image('card_04', 'src/assets/card-4.png');
        this.load.image('card_05', 'src/assets/card-5.png');
        this.load.image('card_06', 'src/assets/card-6.png');
        this.load.image('card_07', 'src/assets/card-7.png');
        this.load.image('card_08', 'src/assets/card-8.png');
        this.load.image('card_09', 'src/assets/card-9.png');
        this.load.image('card_10', 'src/assets/card-10.png');
        this.load.image('card_11', 'src/assets/card-11.png');
        this.load.image('card_12', 'src/assets/card-12.png');
        this.load.image('card_13', 'src/assets/card-13.png');
        this.load.image('card_14', 'src/assets/card-14.png');
        this.load.image('card_15', 'src/assets/card-15.png');
        this.load.image('card_16', 'src/assets/card-16.png');
        this.load.image('card_17', 'src/assets/card-17.png');
        this.load.image('card_18', 'src/assets/card-18.png');
        this.load.image('card_19', 'src/assets/card-19.png');
        this.load.image('card_20', 'src/assets/card-20.png');
        this.load.image('card_21', 'src/assets/card-21.png');
        this.load.image('card_22', 'src/assets/card-22.png');
        this.load.image('card_23', 'src/assets/card-23.png');
        this.load.image('card_24', 'src/assets/card-24.png');
        this.load.image('card_25', 'src/assets/card-25.png');
        this.load.image('card_26', 'src/assets/card-26.png');
        this.load.image('card_27', 'src/assets/card-27.png');
        this.load.image('card_28', 'src/assets/card-28.png');
        this.load.image('card_29', 'src/assets/card-29.png');
        this.load.image('card_30', 'src/assets/card-30.png');
        this.load.image('card_31', 'src/assets/card-31.png');
        this.load.image('card_32', 'src/assets/card-32.png');
        this.load.image('card_33', 'src/assets/card-33.png');
        this.load.image('card_34', 'src/assets/card-34.png');
        this.load.image('card_35', 'src/assets/card-35.png');
        this.load.image('card_36', 'src/assets/card-36.png');
    }

    create() {
        /**   Game   **/
        let round;
        let self = this;
        console.log("This gameID "+this.gameId);
        this.socket.emit("sendRound", this.gameId);
        this.socket.once('saveRound', function (r) {
            round = r; 
            console.log(" ");
            console.log("WE ARE IN ROUND " + round);
        })

        this.dealer = new Dealer(this);
        

        this.socket.emit("dealCards", this.gameId, this.id);
        this.socket.once('dealCards', function (c) {
            console.log("Printed cardNumbers - " + c.length + " : " + c);
            for(let i=0; i<c.length; i++){
                self.cardNumbers[i]=c[i];
                self.cards[i]=c[i];
            }
            self.dealer.dealCards(self.cardNumbers);      
        })

        /**  Score printing  **/
        this.socket.emit("sendScores", self.gameId);

        var style = { 
            fontSize: 34,
            fontFamily: 'Arial',
            align: "left",
            color: '#413b45',
            wordWrap: { width: 250, useAdvancedWrap: true }
        };
        var styleWarning = { 
            fontSize: 24,
            fontFamily: 'Arial',
            align: "left",
            color: 'red',
            wordWrap: { width: 250, useAdvancedWrap: true }
        };

        this.add.text(750, 300, 'Wait for storyteller...', style);

        this.socket.once('submittedStory', function (story) {
            //console.log("Received story! " + story);

            if (self.scene.isActive("ChooseCard")) { 
                self.scene.stop("ChooseCard");
                self.scene.start("ChooseCard", {gameId: self.gameId, server: self.socket, id: self.id, cardNumbers: self.cards, story: story});
            }
            else
                self.scene.start("ChooseCard", {gameId: self.gameId, server: self.socket, id: self.id, cardNumbers: self.cards, story: story});            
        })

    }
}