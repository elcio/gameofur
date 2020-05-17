function randInt(min, max){
    return min + Math.floor(Math.random() * (max + 1))
}

function randNumber(min, max){
    return min + Math.random() * max
}


function Piece(selector, player, piece){

    let div = document.querySelector(selector)
    let outpos = player ? 3.5 : -1.5
    let linepos = player ? 2 : 0
    let position = 0
    let active = false

    let positions = [
        [outpos, piece],
        [linepos, 3], [linepos, 2], [linepos, 1], [linepos, 0],
        [1, 0], [1, 1], [1, 2], [1, 3],
        [1, 4], [1, 5], [1, 6], [1, 7],
        [linepos, 7], [linepos, 6], [linepos, 5],
    ]

    function setpos(n){
        div.style.top = positions[n][0] * 80 + 'px'
        div.style.left = positions[n][1] * 80 + 'px'
    }

    setpos(0)

    piece = {

        get position(){ return position },
        set position(v){
            setpos(v)
            position = v
        },

        get active(){ return active },
        set active(v){
            div.classList[v ? 'add' : 'remove']('active')
            active = v
        }

    }

    div.piece = piece

    return piece

}

function Dice(divclass){

    let div = document.querySelector(divclass)
    let position = randInt(0, 5)
    let row = { changed(){} }

    function setDice(){
        for(let i=0; i<6; i++){
            div.classList.remove('pos' + i)
        }
        div.classList.add('pos' + position)
    }

    setDice()

    return {

        row: row,

        get position(){ return position },
        set position(v){
            position = (v + 6) % 6
            setDice()
            this.row.changed()
        },

        get value(){ return position % 2 },

        run(resolve, reject){
            return new Promise((resolve, reject) => {
                div.classList.add('running')
                div.style.animationDuration = randNumber(0.2, 0.5) + 's'
                let counter = randInt(2, 7)
                let total = this.animateDice(counter)
                setTimeout(()=>{
                    resolve(position)
                    div.classList.remove('running')
                },total+25)
            })
        },

        animateDice(counter){
            let total = 50
            for(let i=0; i < counter; i++){
                total += randInt(25, 50)
                setTimeout(()=>{
                    this.position++
                },total)
            }
            return total
        },

    }

}

function DiceRow(divclass, dices){

    let div = document.querySelector(divclass)

    let row = {

        dices: dices,

        changed(){
            div.innerHTML = this.total
        },

        get total(){
            return dices.map(d => d.value).reduce((a, b) => a + b)
        },

        async run(){
            let p = await Promise.all(dices.map(d => d.run()))
            return this.total
        },

    }

    dices.forEach(d => { d.row=row })

    return row

}

let game = {

    pieces: [0, 1].map(
        player => [0,1,2,3,4,5,6].map(
            piece => Piece(`.p${player+1}.piece${piece}`, player, piece)
        )
    ),

    dices: [0, 1].map(
        player => DiceRow(
            `.dicesum.p${player+1}`, 
            [0,1,2,3].map(
                dice => Dice(`.p${player+1}.dice${dice}`)
            )
        )
    ),

    setWinner(winner){
        if(winner){
            document.querySelector('#winner').innerHTML = winner
            document.querySelector('.message').classList.add('on')
        }else{
            document.querySelector('.message').classList.remove('on')
        }
    },

    get players(){
        return Array.from(document.querySelectorAll('.players select')).map(s => s.selectedIndex)
    },

}

