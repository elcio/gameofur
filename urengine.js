function urengine(engine, steps, game){

    let tests = {
        isCapture(position, target, board){
            return (target > 4 && board[target] == -1 && target != 8)
        },
        isRepeat(position, target, board){
            return (target == 4 || target == 8 || target == 14)
        },
        isGoingToLast(position, target, board){
            return target == 14
        },
        isLeavingWarZone(position, target, board){
            return target>12 && position <= 12
        },
        isLeavingPeaceZone(position, target, board){
            return position < 5 && target >= 5
        },
        isHotTarget(position, target, board){
            if(position > 4 && position < 13 && position != 8){
                if(board[position-2] == -1){
                    return true
                }
            }
            return false
        },
        isColdTarget(position, target, board){
            if(position > 4 && position < 13 && position != 8){
                if(board[position-1] == -1 || board[position-3] == -1){
                    return true
                }
            }
            return false
        },
        isLeavingEight(position, target, board){
            return position == 8
        },
        isGoingToHotTarget(position, target, board){
            if(target > 4 && target < 13 && target != 8){
                if(board[target-2] == -1){
                    return true
                }
            }
            return false
        },
        isGoingToColdTarget(position, target, board){
            if(target > 4 && target < 13 && target != 8){
                if(board[target-1] == -1 || board[target-3] == -1){
                    return true
                }
            }
            return false
        },
        isGoingToHotPosition(position, target, board){
            if(target > 2 && target < 11 && target != 6){
                if(board[target+2] == -1){
                    return true
                }
            }
            return false
        },
        isGoingToColdPosition(position, target, board){
            if(target > 3 && target < 12 && target != 7){
                if(board[target+1] == -1){
                    return true
                }
            }
            if(target > 1 && target < 11 && target != 5){
                if(board[target+3] == -1){
                    return true
                }
            }
            return false
        },
    }

    let engines = [
        {},
        {
            isCapture: 800,
            isRepeat: 400,
            isGoingToLast: -60,
            isLeavingWarZone: 60,
            isLeavingPeaceZone: -10,
            isHotTarget: 30,
            isColdTarget: 10,
            isGoingToHotTarget: -30,
            isGoingToColdTarget: -10,
            isLeavingEight: -20,
            isGoingToHotPosition: 100,
            isGoingToColdPosition: 50,
        },
        {
            isCapture: 80,
            isRepeat: 100,
            isGoingToLast: -60,
            isLeavingWarZone: 600,
            isLeavingPeaceZone: -100,
            isHotTarget: 300,
            isColdTarget: 100,
            isGoingToHotTarget: -300,
            isGoingToColdTarget: -100,
            isLeavingEight: -200,
            isGoingToHotPosition: 10,
            isGoingToColdPosition: 5,
        },
        {
            isCapture: 80,
            isRepeat: 100,
            isGoingToLast: -60,
            isLeavingWarZone: 60,
            isLeavingPeaceZone: -10,
            isHotTarget: 30,
            isColdTarget: 10,
            isGoingToHotTarget: -30,
            isGoingToColdTarget: -10,
            isLeavingEight: -20,
            isGoingToHotPosition: 10,
            isGoingToColdPosition: 5,
        },
    ]

    function mkboard(game){
        let counter = 0
        let board=Array(15).fill(0)
        fillBoard(board, game.table.pieces[game.turn], 1, 1)
        fillBoard(board, game.table.pieces[(game.turn + 1) % 2], 1, -1)
        return board
    }

    function fillBoard(board, pieces, min, player){
        pieces.forEach((piece, idx) => {
            if(piece.position > min - 1 && piece.position < 15){
                board[piece.position] = player
            }
        })
    }

    function calculateScores(possibilities, board, steps){
        let scores = []
        possibilities.forEach((p, idx) => {
            if(p){
                let piece = game.table.pieces[game.turn][idx]
                scores.push(calculateScore(
                    idx, 
                    piece.position,
                    piece.position+steps,
                    board
                ))
            }else{
                scores.push(-1)
            }
        })
        return scores
    }

    function calculateScore(idx, position, target, board){
            let balancedTests = engines[engine-1]
            let score = target

            for(let test in balancedTests){
                if(tests[test](position, target, board)){
                    score += balancedTests[test]
                }
            }

            return 1000+score
    }

    function betterMove(scores){
        let maxScore = scores.reduce((a, b) => Math.max(a, b))
        return scores.indexOf(maxScore)
    }


    let board = mkboard(game)
    let scores = calculateScores(game.possibleMoves.slice(0), board, steps)
    return betterMove(scores)

}
