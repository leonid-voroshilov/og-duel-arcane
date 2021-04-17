import { connect } from "react-redux";
import { useForm } from "react-hook-form";

import { rollHandler, reRollHandler, dpHandler, dmgHandler, endRollHandler } from '../../action'
import { RollStages } from "../../services";



function EndGame(props) {
    const { players, curDuelRoll } = props
    if (curDuelRoll === 4) {

        const isDraw = players[0].pureDamage === players[1].pureDamage
        const winnerID = players[0].pureDamage > players[1].pureDamage ? 0 : 1

        return (
            <div className="card">
                <div className="card-header">
                    <div align="center">
                        <b>Дуэль завершена</b>
                    </div>
                </div>

                <div className="card-body">
                    <div>
                        <i>{players[0].Name}</i> нанёс {players[0].pureDamage} чистого урона <br />
                        <i>{players[1].Name}</i> нанёс {players[1].pureDamage} чистого урона <br /><br />

                        {!isDraw && (<div>Победитель: <i>{players[winnerID].Name}</i> </div>)}
                        {isDraw && (<div>Ничья</div>)}
                    </div>
                </div>
            </div>
        )
    }
    else {
        <div align="center"></div>
        const isDraw = players[0].curWill === players[1].curWill
        const winnerID = players[0].curWill > players[1].curWill ? 0 : 1
        return (< div className="card" >
            <div className="card-header">
                <div align="center">
                    <b>Дуэль завершена</b>
                </div>
            </div>

            <div className="card-body">
                <div>
                    <i>Воля {players[0].Name}</i>: {players[0].curWill} <br />
                Воля  <i>{players[1].Name}</i>: {players[1].curWill}  <br /><br />
                    {!isDraw && (<div>Победитель: <i>{players[winnerID].Name}</i> </div>)}
                    {isDraw && (<div>Ничья</div>)}
                </div>
            </div>
        </div >

        )
    }
}


const mapStateToProps = ({ players, initWinnerId, duelRolls, curDuelRoll, isDPSpend }) => {
    return {
        players,
        curDuelRoll
    }
}
const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(EndGame)