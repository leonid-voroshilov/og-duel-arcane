const  RollStages = { 
    ENDROLL: -1,
    PREROLL_CHOOSE_NEXT_ROLL_DEF: 0,  
    PREROLL: 1, 
    POSTROLL: 2,
}
export class DuelRoll {
    constructor (rollId, atkId){
        this.id = rollId
        this.atkId = atkId
        this.defId = (atkId + 1) % 2
        this.stage = RollStages.PREROLL_CHOOSE_NEXT_ROLL_DEF
        this.roll = null
    }
}


export default RollStages