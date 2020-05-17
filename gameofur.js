
function GameOfUr(gametable){

    let turn = 0

    let game = {

        table: gametable,

        async doTurn(){
            let steps = await gametable.dices[turn].run()
            this.highlightPossible(steps)
        },

        get turn(){
            return turn
        },

        nextTurn(){
            turn = (turn + 1) % 2
            setTimeout(()=>{
                this.doTurn()
            }, 1000)
        },

        highlightPossible(steps){
            let possible = false
            this.possibleMoves=[0,0,0,0,0,0,0]
            if(steps){
                this.table.pieces[turn].forEach((piece, idx) => {
                    piece.active = this.canRun(piece.position + steps)
                    if(piece.active){
                        this.possibleMoves[idx]=1
                        possible = true
                    }
                })
            }
            if(!possible){
                this.nextTurn()
            }else if(this.table.players[turn]){
                let movement = urengine(this.table.players[turn], steps, this)
                this.move(this.table.pieces[turn][movement])
            }
        },

        canRun(position){

            if(position == 15) return true
            if(position > 15 || position == 0) return false

            if(this.anyPiece(turn, position)) return false

            if(position == 8){
                if(this.anyPiece((turn + 1) % 2, position)) return false
            }

            return true
        },

        anyPiece(player, position){

            let possible = false

            this.table.pieces[player].forEach(piece => {
                if(piece.position == position){
                    possible = piece
                }
            })

            return possible

        },

        move(piece){

            this.table.pieces[turn].forEach(piece => {
                piece.active = false
            })

            let targetPosition = piece.position + this.table.dices[turn].total

            if(targetPosition > 4 && targetPosition < 13){
                let target = this.anyPiece((turn + 1) % 2, targetPosition)
                if(target) {
                    setTimeout(() => {
                        target.position = 0
                    }, 400)
                }
            }

            piece.position = targetPosition

            if(this.table.pieces[turn].every(p => p.position == 15)){
                return this.table.setWinner(turn+1)
            }

            if(piece.position == 4 || piece.position == 8 || piece.position == 14){
                return setTimeout(()=>{
                    this.doTurn()
                }, 1000)
            }else{
                this.nextTurn()
            }

        },

        newGame(){
            this.table.pieces.flat().forEach(p => p.position=0)
            this.table.setWinner(0)
            this.nextTurn()
        },

    }

    document.querySelectorAll('.piece').forEach(piece => {
        piece.addEventListener('click', ev => {
            if(piece.piece.active){
                game.move(piece.piece)
            }
        })
    })

    document.querySelector('.message button').addEventListener('click', ev => {
        game.newGame()
    })

    return game

}

game = GameOfUr(game)
game.doTurn()
