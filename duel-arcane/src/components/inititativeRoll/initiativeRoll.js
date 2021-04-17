import { connect } from "react-redux";
import { getRandomInt } from "../../utils/Roller";
import { registerInititativeWinner } from '../../action'

function InitiativeRoll(props) {
    const players = props.players
    var result = [0, 0]
    var winnerId
    var rolls
    while (result[0] === result[1]) {
        rolls = [getRandomInt(1, 10), getRandomInt(1, 10)]
        result = [rolls[0] + parseInt(players[0].InitMod), rolls[1] + parseInt(players[1].InitMod)]
        winnerId = result[0] > result[1] ? 0 : 1
    }

    const onClick = (e) => {
        props.registerInititativeWinner(winnerId)
    }
    return (
        <div className="card">
            <div className="card-header align-items-center">
            <div align="center">
                <i>Бросок инициативы</i>
            </div>
            </div>
            <div className="card-body">
                {props.initWinnerId == null && <div>
                    <i>{players[0].Name}</i>: {rolls[0]} + {players[0].InitMod} = {result[0]} <br />
                    <i>{players[1].Name}</i>: {rolls[1]} + {players[1].InitMod} = {result[1]} <br />
                    <button onClick={onClick}>Выбор щита и меча</button>
                </div>}

                {props.initWinnerId != null && <div>
                    Победитель <b>{players[props.initWinnerId].Name}</b>. <br />
                   
                </div>}
            </div>
        </div>
    )
}

const mapStateToProps = ({ players, initWinnerId }) => {
    return {
        players,
        initWinnerId
    }
}
const mapDispatchToProps = {
    registerInititativeWinner

}
export default connect(mapStateToProps, mapDispatchToProps)(InitiativeRoll)