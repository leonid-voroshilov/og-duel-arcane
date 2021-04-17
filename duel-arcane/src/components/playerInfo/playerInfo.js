import { connect } from "react-redux";
import { useForm } from "react-hook-form";

import { registerPlayerParam } from '../../action'

function PlayerInfo(props) {
    const { register, handleSubmit } = useForm();
    const { id, players, initWinnerId } = props
    const playerInfo = players[id]

    const AtkMod = () => {
        if (playerInfo.AtkMod && playerInfo.AtkMod !== 0)
        {
            if (playerInfo.AtkMod > 0)
                return <b><font color="green"> + {playerInfo.AtkMod}</font> </b>
                else return <b><font color="red">{playerInfo.AtkMod}</font> </b>
        }
        return null;
    }
    const Mod = () => {
        if (playerInfo.Mod && playerInfo.Mod !== 0)
        {
            if (playerInfo.Mod > 0)
                return <div><span className="badge bg-success">+ {playerInfo.Mod }</span></div>
                else return <div><span className="badge bg-danger"> {playerInfo.Mod }</span></div>
        }
        return <div>  <br /> </div>;
    }
    const onSubmit = data => {
        console.log(data)
        console.log({ ...playerInfo, ...data, isValidated: true })
        props.registerPlayerParam(id, { ...playerInfo, ...data, isValidated: true, curWill: data.Will })
    }

    console.log("PlayerInfo:", playerInfo)
    const progress =  id === 0? "progress" : "progress flex-row-reverse"
    if (playerInfo.isValidated) {
        return (<div className="card">
            <div className="card-header">
            <div align="center">
                <b>{playerInfo.Name}</b>
            </div>
                
            </div>
            <div className="card-body">
                <div className="row gy-2 gx-3 align-items-center">
                    Гнозис: {playerInfo.Gnosis} <br />
                            Модификатор инициативы: {playerInfo.InitMod}  <br />
                    {playerInfo.hasIronWill ? <div>  <b>Железная Воля</b> </div> : <div>  <br /> </div>}
                    {initWinnerId === id ? <div><b>Выиграл инициативу</b> </div> : <div>  <br /> </div>}
                    {playerInfo.Sword ? <div> Меч:  <b>{playerInfo.Sword}</b> ({playerInfo.Atk}<AtkMod/>)</div> : <div>  <br /> </div>}
                    {playerInfo.Shield ? <div> Щит:  <b>{playerInfo.Shield}</b> ({playerInfo.Def}) </div> : <div>  <br /> </div>}
                    <Mod />
                    
                    <div className={progress}  >
                        <div className="progress-bar " role="progressbar" style={{width: (Math.max(0, playerInfo.curWill * 100.0) / playerInfo.Will).toString() + "%"}} >
                            {playerInfo.curWill} / {playerInfo.Will}</div>
                    </div>

                    <br/>
                </div>
            </div>
        </div>)
    }
    else
        return (
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="card">
                    <div className="card-header">
                        <input type="name" name="Name" className="form-control" placeholder="Имя Дуэлянта" ref={register({ required: true })} />
                    </div>
                    <div className="card-body">
                        <div className="row gy-2 gx-3 align-items-center">
                            <input name="Gnosis" className="form-control" placeholder="Гнозис" type="number" ref={register({ min: 1 })} />
                            <input name="Will" className="form-control" placeholder="ПСВ" type="number" ref={register({ min: 1 })} />
                            <input name="InitMod" className="form-control" placeholder="Модификатор инициативы (с учетом свойства 'хорошая реакция')" type="number" ref={register({ min: 0 })} />
                            <div className="form-check">
                                <input type="checkbox" name="hasIronWill" ref={register} />  &nbsp;
                            <label>Есть Железная Воля</label>
                            </div>
                            <span> <br /></span>
                            <input type="submit" className="btn btn-primary" value="Подтвердить параметры дуэлянта" />
                        </div>
                    </div>
                </div>
            </form>
        )

}


const mapStateToProps = ({ players, initWinnerId }) => {
    return {
        players, 
        initWinnerId,
    }
}
const mapDispatchToProps = {
    registerPlayerParam, 
}
export default connect(mapStateToProps, mapDispatchToProps)(PlayerInfo)