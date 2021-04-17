import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { registerPlayersMod } from "../../action";
import GetRoll from "../../utils/Roller";



function WillFight(props) {
    const { players } = props
    const result = [GetRoll(players[0].Will, true, players[0].hasIronWill, false),
    GetRoll(players[1].Will, true, players[1].hasIronWill, false)]
    const { register, handleSubmit } = useForm();
    var mod = [0, 0]
    const onSubmit = data => {
        console.log(data, mod);
        props.registerPlayersMod(data.FstAtk, mod)
    }
    const initLoserId = (props.initWinnerId + 1) % 2

    var res
    switch (result[0].status) {
        case "Botch":
            switch (result[1].status) {
                case "Botch":
                    res = <div> Паритет. Ни один из дуэлянтов не получает преимуществ или штрафов. <br />
                            Дуэлянт с наименьшей инициативой может атаковать первым, если не пожелает уступить возможность противнику; противник не может отказаться.</div>
                    break;
                case "Unsuccess":
                    mod[0] = -1
                    res = <div> {players[1].Name} не получает преимуществ или штрафов.<br />
                        {players[0].Name} выбросил драматический провал, {players[0].Name} получает -1 куб на все последующие броски в Дуэли Тайн и считается проигравшим поединок Воли:
                         он может атаковать первым, если не пожелает уступить возможность противнику; противник не может отказаться.

                    </div>
                    break;
                case "Success":
                    mod[1] = 1
                    mod[0] = -1
                    res = <div> {players[1].Name}  набрал большее количество успехов и получает +1 куб на все последующие броски в Дуэли.<br />
                        {players[0].Name} выбросил драматический провал, {players[0].Name} получает -1 куб на все последующие броски в Дуэли Тайн и считается проигравшим поединок Воли:
                        он может атаковать первым, если не пожелает уступить возможность противнику; противник не может отказаться. </div>
                    break;
                    default:
                        break;
            }
            break;
        case "Unsuccess":
            switch (result[1].status) {
                case "Botch":
                    mod[1] = -1
                    res = <div> {players[0].Name} не получает преимуществ или штрафов.<br />
                        {players[1].Name} выбросил драматический провал, {players[1].Name} получает -1 куб на все последующие броски в Дуэли Тайн
                         и считается проигравшим поединок Воли: он может атаковать первым, если не пожелает уступить возможность противнику; противник не может отказаться. </div>
                    break;
                case "Unsuccess":
                    res = <div> Паритет. Ни один из дуэлянтов не получает преимуществ или штрафов. <br />
                             {players[initLoserId].Name} может атаковать первым, если не пожелает уступить возможность противнику; противник не может отказаться.</div>
                    break;
                case "Success":
                    mod[1] = 1
                    res = <div> {players[1].Name}  набрал большее количество успехов и получает +1 куб на все последующие броски в Дуэли.<br />
                        {players[0].Name} не получает преимуществ или штрафов. <br />
                        {players[0].Name} проиграл поединок Воли и  может атаковать первым, если не пожелает уступить возможность противнику; противник не может отказаться.
                    </div>
                    break;
                    default:
                        break;
            }
            break;
        case "Success":
            switch (result[1].status) {
                case "Botch":
                    mod[1] = -1
                    mod[0] = 1
                    res = <div> {players[0].Name}  набрал большее количество успехов и получает +1 куб на все последующие броски в Дуэли.<br />
                        {players[1].Name} выбросил драматический провал, {players[1].Name} получает -1 куб на все последующие броски в Дуэли Тайн.<br />
                        {players[1].Name} считается проигравшим поединок Воли и может атаковать первым,
                    если не пожелает уступить возможность противнику; противник не может отказаться. </div>
                    break;
                case "Unsuccess":
                    mod[0] = 1
                    res = <div> {players[0].Name}  набрал большее количество успехов и получает +1 куб на все последующие броски в Дуэли.<br />
                        {players[1].Name} не получает преимуществ или штрафов..<br />
                        {players[1].Name} считается проигравшим поединок Воли и может атаковать первым,
                    если не пожелает уступить возможность противнику; противник не может отказаться. </div>
                    break;
                case "Success":
                    if (result[0].val === result[1].val) {
                        res = <div> Паритет. Ни один из дуэлянтов не получает преимуществ или штрафов. <br />
                        {players[initLoserId].Name} может атаковать первым, если не пожелает уступить возможность противнику; противник не может отказаться.</div>

                    } else {
                        const winnerId = result[0].val > result[1].val ? 0 : 1
                        const loserId = (winnerId + 1) % 2
                        mod[winnerId] = 1
                        res = <div> {players[winnerId].Name}  набрал большее количество успехов и получает +1 куб на все последующие броски в Дуэли.<br />
                            {players[loserId].Name} считается проигравшим поединок Воли и может атаковать первым,
                                                если не пожелает уступить возможность противнику; противник не может отказаться. </div>
                    }
                    break;
                    default:
                        break;
            }
            break;
            default:
                break;
    }
    return (<div className="card">
        <div className="card-header align-items-center">
        <div align="center">
            <i>Поединок воли</i>
        </div>
        </div>
        <div className="card-body">
            Бросок <i>{players[0].Name}</i>: {result[0].str}  &rarr; {result[0].val} <br />
            Бросок <i>{players[1].Name}</i>: {result[1].str}  &rarr; {result[1].val}
            {res}
            <form onSubmit={handleSubmit(onSubmit)}>
                Первым атакует: <select name="FstAtk" ref={register({ required: true })}>
                    <option value={0}>{players[0].Name}</option>
                    <option value={1}>{players[1].Name}</option>

                </select>
                <input type="submit" />
            </form>
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
    registerPlayersMod

}
export default connect(mapStateToProps, mapDispatchToProps)(WillFight)