import React, { Component } from 'react';
import { connect } from 'react-redux';
import { nextGameStage } from '../../action';
import RowSplitter from '../hoc/rowSplitter';
import PlayerInfo from '../playerInfo/playerInfo';
import InitiativeRoll from '../inititativeRoll/initiativeRoll'
import { GameStages } from '../../services';
import SelectSwordAndShield from '../selectSwordAndShield/selectSwordAndShield';
import WillFight from '../WillFight/willFight';
import DuelRolls from '../duelRolls/duelRolls';
import EndGame from '../endGame/endGame';

class App extends Component {
    debugInfo = () => {
        console.log("props:", this.props);
        //this.props.nextGameStage(this.props.state.gameStage)
    }
    onButtonClick = (e) => {
        this.props.nextGameStage(this.props.state.gameStage)
    }
    render(){
        console.log("props:", this.props);
        return (<div>
            <RowSplitter left = {<PlayerInfo id = {0}/>} right = {<PlayerInfo id = {1} />} />
            {this.props.state.gameStage === GameStages.SETUP && this.props.state.players[0].isValidated && this.props.state.players[0].isValidated && 
            <div>
                <button onClick={this.onButtonClick}> Бросок инициативы </button> <br/>
                </div>}
            {this.props.state.gameStage === GameStages.INITIATIVE_ROLL && <InitiativeRoll />}
            {this.props.state.gameStage === GameStages.SELECT_SWORD_AND_SHIELD && <SelectSwordAndShield />}
            {this.props.state.gameStage === GameStages.WILL_FIGHT && <WillFight />}
            {this.props.state.gameStage === GameStages.DUEL && <DuelRolls />}
            {this.props.state.gameStage === GameStages.ENDGAME && <EndGame/>}

            
            
        </div>);

    }
}
 /* 
<button onClick={this.debugInfo}> DebugInfo </button> <br />
            1. Защищающийся решает что он делает на следующий ход. <br />
                2. Защищающийся решает, какие модификаторы он применяет. (никакие) <br />
                3. Атакующий применяет свои модификаторы. <br />
                4. Бросок. <br />
                5. Защищающийся объявляет переброс. (он не может?) <br />
                6. Атакующий заявляет переброс. <br />
                7. Победитель инициативы может сжечь спичку. <br />
                8. Второй игрок может заявить спичку. <br />
                9. Фиксирование результатов. <br />*/ 

const mapStateToProps = (state) => {
    return {
        state
    }
}

const mapDispatchToProps = {
    nextGameStage
}
export default connect(mapStateToProps, mapDispatchToProps)(App)