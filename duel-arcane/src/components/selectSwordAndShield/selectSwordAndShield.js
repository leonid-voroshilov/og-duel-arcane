import { connect } from "react-redux";
import { registerPlayerSwordAndShield, nextGameStage} from '../../action'
import { useForm } from 'react-hook-form';
import WEIGHTS from "./weights";
import { GameStages } from "../../services";


function SelectSwordAndShield(props) {
    const { players, initWinnerId } = props
    const secondId = (initWinnerId + 1) % 2
    const { register, handleSubmit} = useForm();
    const onClick = e => {
        props.nextGameStage(GameStages.SELECT_SWORD_AND_SHIELD)        
    }
    const onSubmit = data => {
        console.log(data);
        console.log(WEIGHTS[data.Shield][data.Sword])
        const id = players[initWinnerId].Shield === undefined ? initWinnerId : secondId
        props.registerPlayerSwordAndShield(id, data.Sword, data.Shield, data.Atk, data.Def)
        }
        
        return (
            <div className="card">
            <div className="card-header align-items-center">
            <div align="center">
                <i>Выбор щита и меча</i>
            </div>
            </div>
            <div className="card-body">
            {players[initWinnerId].Shield === undefined && <div>Дуэлянты поочередно описывают, как их преобразил Дуэльный Круг. <br/> Первым свой выбор делает <i>{players[initWinnerId].Name}</i>. <br /></div>}    
            {players[initWinnerId].Shield !== undefined && players[secondId].Shield === undefined && <div>Вторым свой выбор делает <i>{players[secondId].Name}</i></div>}  
            {(players[initWinnerId].Shield === undefined || players[secondId].Shield === undefined) && 
                <form onSubmit={handleSubmit(onSubmit)}>
                    Меч: <select name = "Sword" ref={register({ required: true })}>
                        <option value="Смерть">Смерть</option>
                        <option value="Судьба">Судьба</option>
                        <option value="Силы">Силы</option>
                        <option value="Жизнь">Жизнь</option>
                        <option value="Материя">Материя</option>
                        <option value="Разум">Разум</option>
                        <option value="Основы">Основы</option>
                        <option value="Пространство">Пространство</option>
                        <option value="Дух">Дух</option>
                        <option value="Время">Время</option>
                    </select> <input name="Atk" placeholder="Значение" type="number" ref={register({ min: 1 })} /><br/>
                    Щит: <select name ="Shield" ref={register({ required: true })}>
                        <option value="Смерть">Смерть</option>
                        <option value="Судьба"> Судьба</option>
                        <option value="Силы"> Силы</option>
                        <option value="Жизнь"> Жизнь</option>
                        <option value="Материя"> Материя</option>
                        <option value="Разум"> Разум</option>
                        <option value="Основы"> Основы</option>
                        <option value="Пространство"> Пространство</option>
                        <option value="Дух"> Дух</option>
                        <option value="Время"> Время</option>
                    </select> <input name="Def" placeholder="Значение" type="number" ref={register({ min: 1 })} /><br/>
                    <input type="submit" />
                </form>}
            {(players[initWinnerId].Shield !== undefined && players[secondId].Shield !== undefined) && <button onClick={onClick}>Поединок воли </button>}

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
    registerPlayerSwordAndShield, nextGameStage

}
export default connect(mapStateToProps, mapDispatchToProps)(SelectSwordAndShield)