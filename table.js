function Piece(selector, player, piece){
    let div = document.querySelector(selector)
    let outpos = player ? 3.5 : -1.5
    let linepos = player ? 2 : 0
    let positions = [
        [outpos, piece],
        [linepos, 3],
        [linepos, 2],
        [linepos, 1],
        [linepos, 0],
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 5],
        [1, 6],
        [1, 7],
        [linepos, 7],
        [linepos, 6],
        [linepos, 5],
    ]
    let position = 0
    let active = false
    function setpos(n){
        div.style.top = positions[n][0] * 80 + 'px'
        div.style.left = positions[n][1] * 80 + 'px'
    }
    setpos(0)
    return {
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
}
function Dice(divclass){
    let div = document.querySelector(divclass)
    let position = Math.floor(Math.random() * 6)
    let row = {
        changed(){}
    }
    function setDice(){
        Array(6).fill(0).forEach((z, idx) => {
            div.classList.remove('pos' + idx)
        })
        div.classList.add('pos' + position)
    }
    setDice()
    return {
        get position(){ return position },
        set position(v){
            position = (v + 6) % 6
            setDice()
            this.row.changed()
        },
        get value(){ return position % 2 },
        run(resolve, reject){
            let p = new Promise((resolve, reject) => {
                let counter = Math.floor(Math.random() * 6 + 6)
                let total = 100
                for(let i=9; i<counter.length; i++){
                    total += Math.floor(50 + Math.random() * 100)
                    console.log(total)
                    setTimeout(()=>{
                        position++
                        setDice()
                    },total)
                }
                setTimeout(()=>{resolve(position)},total+100)
            })
            return p
        },
        row: row,
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
        run(callback){
            let p = Promise.all(dices.map(d => d.run(callback)))
            return p
        },
    }
    dices.forEach(d => { d.row=row })
    return row
}
let players = [0, 1].map(
    player => [0,1,2,3,4,5,6].map(
        piece => Piece(`.p${player+1}.piece${piece}`, player, piece)
    )
)

let dices = [0, 1].map(
    player => DiceRow(
        `.dicesum.p${player+1}`, 
        [0,1,2,3].map(
            dice => Dice(`.p${player+1}.dice${dice}`)
        )
    )
)

