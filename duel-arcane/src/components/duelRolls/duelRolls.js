import { connect } from "react-redux";
import { useForm } from "react-hook-form";

import { rollHandler, reRollHandler, dpHandler, dmgHandler, endRollHandler } from '../../action'
import { RollStages } from "../../services";



function DuelRolls(props) {
    const { players, initWinnerId, duelRolls, curDuelRoll, rollHandler, isDPSpend, reRollHandler, dpHandler, dmgHandler, endRollHandler } = props
    const { register, handleSubmit } = useForm();
    const onSubmit = data => {
        console.log(data);
        rollHandler(curDuelRoll, data)
    }
    const showWarning = () => {
        if (curDuelRoll < 1)
            return false
        else return duelRolls[curDuelRoll].defId === duelRolls[curDuelRoll - 1].defId
    }
    const showMsg = () => {
        if (curDuelRoll > 4)
            return false
        else if (curRoll.stage > RollStages.PREROLL_CHOOSE_NEXT_ROLL_DEF) return duelRolls[curDuelRoll].defId === duelRolls[curDuelRoll + 1].defId
        return false
    }
    const onReroll = data => {
        console.log(data);
        reRollHandler(curDuelRoll, duelRolls[curDuelRoll].roll.val < 0)

    }
    const onDp = data => {
        console.log(data);
        dpHandler(curDuelRoll, data.DP)

    }
    const onNext = (dmg) => {
        console.log(dmg);
        dmgHandler(curDuelRoll, dmg, parseInt(curRoll.defId), parseInt(curRoll.atkId))

    }
    const onEnd = (dmg) => {
        console.log(dmg);
        endRollHandler(curDuelRoll)

    }
    var curRoll = duelRolls[curDuelRoll]
    const atacker = <i>{players[parseInt(curRoll.atkId)].Name} </i>
    const defender = <i>{players[parseInt(curRoll.defId)].Name} </i>
    const initWinner = <i>{players[parseInt(initWinnerId)].Name} </i>
    const initLoser = <i>{players[parseInt((initWinnerId + 1) % 2)].Name} </i>

    console.log(curRoll, players[parseInt(curRoll.atkId)], parseInt(curDuelRoll.atkId), props, curRoll)

    const RollBody = () => {
        var res = null
        var reRollRes = null;
        if (curRoll.reroll !== undefined) {
            reRollRes = curRoll.roll.val < 0 ? curRoll.roll.val + 1 + curRoll.reroll.val : curRoll.roll.val + curRoll.reroll.val
        }

        switch (curRoll.stage) {
            case RollStages.PREROLL_CHOOSE_NEXT_ROLL_DEF:

                res = <div> <form onSubmit={handleSubmit(onSubmit)}>
                    {defender} выбирает действие на следующий ход: <select name="nextAction" ref={register({ required: true })}>
                        <option value="Atk">Атака</option>
                        <option value="Def">Защита</option>
                    </select>
                    <input type="submit" />
                </form>
                    {showWarning() && (<b><font color="red">{defender} дважды подряд защищался. Если он выберет защиту третий раз подряд, то будет признан проигравшим. </font></b>)}


                </div>
                break;
            case RollStages.PREROLL:
                res = <form onSubmit={handleSubmit(onSubmit)}>
                    {atacker} решает хочет ли он усилить свой бросок:  <br />


                    <div className="form-check"> <input type="checkbox" name="will" ref={register} />  &nbsp;
                            <label>ПСВ (+3) </label></div>
                    <input type="submit" />
                </form>
                /* <div className="form-check"> <input type="checkbox" name="fate" ref={register} />  &nbsp;
                 <label>Свойство "Судьба"  (+2, один раз за турнир )</label></div>*/

                break;
            case RollStages.POSTROLL:
                const { gnosis, sword, defMul, shield, rollBuf } = curRoll.params
                res = <div>
                    {atacker} атакует: <i>Гнозис ({gnosis}) + Меч({sword}) - Щит({shield}) * {defMul} + Модификаторы({rollBuf}) = {gnosis + sword - defMul * shield + rollBuf}</i> <br />
                    <div align="center">
                        {curRoll.roll.str} &rarr; <b>{curRoll.roll.val}</b> <br /><br />
                    </div>
                    {curRoll.reroll === undefined && (<form onSubmit={handleSubmit(onReroll)}>
                        {atacker} может перебросить куб. <input type="submit" value="Перебросить куб" />
                        <br />
                    </form>)}
                    {curRoll.reroll !== undefined && (<div>
                        {atacker} перебросил куб. {curRoll.reroll.str} &rarr; {curRoll.reroll.val}. <span />
                             Предварительных успехов: {reRollRes}.

                    </div>)}
                    <br />
                    {!isDPSpend && (
                        <form onSubmit={handleSubmit(onDp)}>
                            <div className="form-check">
                                {initWinner} может потратить ЕД. <br />
                                {initLoser} может потратить ЕД, если этого не сделал {initWinner}.  <br /><br />

                                <div className="input-group mb-4">
                                    <input name="DP" className="form-control" placeholder="Количество успехов после применения ЕД (один раз за бой)" type="number" ref={register()} />
                                <div className="input-group-append">
                                    <span> 	&nbsp; <input type="submit" value="Применить ЕД" />   </span></div></div>
                            </div>
                        </form>)}
                    <button onClick={() => onEnd()}>Зафиксировать результат</button>
                </div>

                break;
            case RollStages.ENDROLL:
                var damage
                if (curRoll.finalRes !== undefined)
                    damage = parseInt(curRoll.finalRes)
                else if (reRollRes !== null)
                    damage = reRollRes
                else damage = curRoll.roll.val
                if (damage > 0)
                    res = <div>
                        {atacker} наносит {defender} {damage} урона. <br />
                        <button onClick={() => onNext(damage)}>Следующий раунд</button>
                    </div>
                else if (damage < 0) {
                    damage = -1
                    res = <div>
                        {atacker} наносит cебе 1 урон.<br />
                        <button onClick={() => onNext(-1)}>Следующий раунд</button>
                    </div>
                }
                else
                    res = <div>
                        {atacker} не наносит {defender} урон.<br />
                        <button onClick={() => onNext(0)}>Следующий раунд</button>
                    </div>


                break;
            default:
                break
        }


        return (
            res
        )
    }
    return (
        <div className="card">
            <div className="card-header">
                <div align="center">
                    <i>Раунд {curDuelRoll + 1} </i>
                </div>
            </div>
            <div className="card-body">
                <div className="row gy-2 gx-3 align-items-center">
                    <span> Атакует:  {atacker}</span> <br />
                    <span> Защищается: {defender} </span> <br />
                    <RollBody />
                    {showMsg() && (<b><font color="green">{defender} удваивает свою защиту на следующий раунд. </font></b>)}

                </div>
            </div>
        </div>
    )
}


const mapStateToProps = ({ players, initWinnerId, duelRolls, curDuelRoll, isDPSpend }) => {
    return {
        players,
        initWinnerId,
        duelRolls,
        curDuelRoll,
        isDPSpend
    }
}
const mapDispatchToProps = {
    rollHandler,
    reRollHandler,
    dpHandler,
    dmgHandler,
    endRollHandler
}
export default connect(mapStateToProps, mapDispatchToProps)(DuelRolls)