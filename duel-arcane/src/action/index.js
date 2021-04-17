import { GameStages } from "../services"

const nextGameStage = (gameStage) => {
    let nextStage = GameStages.SETUP
    switch (gameStage) {
        case GameStages.SETUP:
            nextStage = GameStages.INITIATIVE_ROLL
            break
        case GameStages.INITIATIVE_ROLL:
            nextStage = GameStages.SELECT_SWORD_AND_SHIELD
            break
        case GameStages.SELECT_SWORD_AND_SHIELD:
            nextStage = GameStages.WILL_FIGHT
            break
        case GameStages.WILL_FIGHT:
            nextStage = GameStages.DUEL
            break
        default:
            nextStage = GameStages.ENDGAME
            break
    }
    return {
        type: 'SET_GAME_STAGE',
        gameStage: nextStage
    }

}

const registerPlayerParam = (id, playerParam) => {
    return {
        type: 'SET_PLAYER_PARAM',
        id,
        playerParam
    }
}

const registerInititativeWinner = (winnderId) => {
    return {
        type: 'SET_INITITATIVE_WINNER',
        winnderId,
        gameStage: GameStages.SELECT_SWORD_AND_SHIELD
    }
}

const registerPlayerSwordAndShield = (id, Sword, Shield, Atk, Def) => {
    return {
        type: 'SET_SWORD_AND_SHIELD',
        id,
        Sword,
        Shield,
        Atk,
        Def
    }
}

const registerPlayersMod = (atkId, mods) => {
    return {
        type: 'SET_WILL_FIGHT',
        atkId,
        mods,
    }
}

const rollHandler = (rollId, data) => {

    return {
        type: 'ROLL_HANDLER',
        id: rollId,
        data
    }
}

const reRollHandler = (rollId, isChanceDie) => {

    return {
        type: 'REROLL_HANDLER',
        id: rollId,
        isChanceDie
    }
}

const dpHandler = (rollId, dpReroll) => {

    return {
        type: 'DP_HANDLER',
        id: rollId,
        dpReroll, 
    }
}
const endRollHandler = (rollId) => {

    return {
        type: 'ENDROLL_HANDLER',
        id: rollId,
    }
}

const dmgHandler = (rollId, damage, target, aggressor) => {

    return {
        type: 'DAMAGE_HANDLER',
        id: rollId,
        damage, 
        target, 
        aggressor
    }
}



export { nextGameStage, registerPlayerParam, registerInititativeWinner, registerPlayerSwordAndShield, registerPlayersMod, rollHandler, 
        reRollHandler, dpHandler, dmgHandler, endRollHandler}