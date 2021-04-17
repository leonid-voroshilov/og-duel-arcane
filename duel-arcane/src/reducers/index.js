import WEIGHTS from "../components/selectSwordAndShield/weights";
import { GameStages, Player } from "../services";
import RollStages, { DuelRoll } from "../services/rollStages";
import GetRoll from "../utils/Roller";

const initialState = {
    gameStage: GameStages.SETUP,
    players: [new Player(0), new Player(1)],
    initWinnerId: null,
    duelRolls: null,
    curDuelRoll: null,
    isDPSpend: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_GAME_STAGE":
            return {
                ...state,
                gameStage: action.gameStage
            }
        case "SET_PLAYER_PARAM":
            var newPlayers = state.players.map(
                playerItem => playerItem.id === action.id ? { ...playerItem, ...action.playerParam } : playerItem);
            return {
                ...state,
                players: newPlayers
            }
        case "SET_INITITATIVE_WINNER":
            return {
                ...state,
                initWinnerId: action.winnderId,
                gameStage: action.gameStage
            }
        case "SET_SWORD_AND_SHIELD":
            newPlayers = state.players.map(
                playerItem => playerItem.id === action.id ? { ...playerItem, Sword: action.Sword, Shield: action.Shield, Atk: action.Atk, Def: action.Def } : playerItem);
            if (newPlayers[0].Sword && newPlayers[1].Sword) {
                const w = calculateMod(newPlayers)
                newPlayers[0].AtkMod = w[0]
                newPlayers[1].AtkMod = w[1]
            }
            return {
                ...state,
                players: newPlayers
            }

        case "SET_WILL_FIGHT":
            newPlayers = state.players.map(
                playerItem => {
                    return {
                        ...playerItem,
                        Mod: action.mods[playerItem.id]
                    }
                });
            return {
                ...state,
                players: newPlayers,
                duelRolls: [new DuelRoll(0, parseInt(action.atkId))],
                curDuelRoll: 0,
                gameStage: GameStages.DUEL
            }
        case "REROLL_HANDLER":
            var newRolls = state.duelRolls.map(
                rollItem => rollItem.id === action.id ? { ...rollItem, reroll: GetRoll(action.isChanceDie ? -1 : 1) } : rollItem);

            return {
                ...state,
                duelRolls: newRolls
            }
        case "DP_HANDLER":
            newRolls = state.duelRolls.map(
                rollItem => rollItem.id === action.id ? { ...rollItem, finalRes: action.dpReroll, stage: RollStages.ENDROLL } : rollItem);

            return {
                ...state,
                duelRolls: newRolls,
                isDPSpend: true
            }
        case "ENDROLL_HANDLER":
            newRolls = state.duelRolls.map(
                rollItem => rollItem.id === action.id ? { ...rollItem, stage: RollStages.ENDROLL } : rollItem);

            return {
                ...state,
                duelRolls: newRolls,
            }
        case "DAMAGE_HANDLER":
            var targetID = action.damage > 0 ? action.target : action.aggressor
            var damage =  action.damage < 0 ? action.damage * -1 : action.damage           
            newPlayers = state.players.map(
                playerItem => playerItem.id === targetID ? { ...playerItem, curWill: parseInt(playerItem.curWill) - parseInt(damage)} : playerItem);

            if (action.damage > 0){
                newPlayers[action.aggressor].pureDamage += parseInt(action.damage) 
            }    

            if (action.id + 1 < 5 && parseInt(newPlayers[0].curWill) > 0 &&  parseInt(newPlayers[1].curWill) > 0 ) {
                return {
                    ...state,
                    players: newPlayers,
                    curDuelRoll: action.id + 1
                }
            }
            else {
                return {
                    ...state,
                    players: newPlayers,
                    gameStage: GameStages.ENDGAME
                }
            }



        case "ROLL_HANDLER": {
    switch (state.duelRolls[action.id].stage) {
        case RollStages.PREROLL_CHOOSE_NEXT_ROLL_DEF:
            newRolls = state.duelRolls.map(
                rollItem => rollItem.id === action.id ? { ...rollItem, stage: RollStages.PREROLL } : rollItem);
            const nextAtk = parseInt(action.data.nextAction === "Atk" ? newRolls[action.id].defId : newRolls[action.id].atkId)
            newRolls.push(new DuelRoll(action.id + 1, nextAtk))

            return {
                ...state,
                duelRolls: newRolls
            }
        case RollStages.PREROLL:
            newRolls = state.duelRolls.map(
                rollItem => rollItem.id === action.id ? { ...rollItem, stage: RollStages.POSTROLL } : rollItem);

            var rollBuf = action.data.will[0] === "on" ? 3 : 0
            //rollBuf += action.data.fate[0] === "on" ? 2 : 0
            
            newPlayers = state.players.map(
                playerItem => {
                    return {
                        ...playerItem,
                    }
                });
            if (rollBuf >= 3){
                newPlayers[newRolls[action.id].atkId].curWill -= 1 
            }
            
            const defMul = calculateDefMul(action.id, newRolls)
            const gnosis = parseInt(state.players[newRolls[action.id].atkId].Gnosis)
            const sword = parseInt(state.players[newRolls[action.id].atkId].Atk) + parseInt(state.players[newRolls[action.id].atkId].Mod) + parseInt(state.players[newRolls[action.id].atkId].AtkMod)
            const shield = parseInt(state.players[newRolls[action.id].defId].Def)

            const roll = GetRoll(gnosis + sword - defMul * shield + rollBuf)
            newRolls[action.id].roll = roll
            newRolls[action.id].params = { gnosis, sword, defMul, shield, rollBuf }

            return {
                ...state,
                duelRolls: newRolls, 
                players: newPlayers
            }
        default:
            return state;
    }
}

        default:
return state;
    }

}
function calculateDefMul(curRollId, rolls) {
    if (curRollId < 1)
        return 1
    else return rolls[curRollId].defId === rolls[curRollId - 1].defId ? 2 : 1
}
function calculateMod(players) {
    return [WEIGHTS[players[1].Shield][players[0].Sword], WEIGHTS[players[0].Shield][players[1].Sword]]
}

export default reducer;