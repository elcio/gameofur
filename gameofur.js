
function GameOfUr(gametable){

    let turn = 0

    let game = {

        table: gametable,

        async doTurn(){
            let steps = await gametable.dices[turn].run()
            this.highlightPossible(steps)
        },

        nextTurn(){
            turn = (turn + 1) % 2
            setTimeout(()=>{
                this.doTurn()
            }, 1000)
        },

        highlightPossible(steps){
            let possible = false
            if(steps){
                this.table.pieces[turn].forEach(piece => {
                    piece.active = this.canRun(piece.position + steps)
                    if(piece.active){
                        possible = true
                    }
                })
            }
            if(!possible){
                this.nextTurn()
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

            if(piece.position == 4 || piece.position == 8 || piece.position == 14){
                return setTimeout(()=>{
                    this.doTurn()
                }, 1000)
            }else{
                this.nextTurn()
            }

        },

    }

    document.querySelectorAll('.piece').forEach(piece => {
        piece.addEventListener('click', ev => {
            if(piece.piece.active){
                game.move(piece.piece)
            }
        })
    })

    return game

}

game = GameOfUr(game)
game.doTurn()
