import React from 'react';
import './TypeTooltip.css'


export default class TypeTooltip extends React.Component {

    render() {
        const { active } = this.props
        const typeColorMap = { Land: "#8e8e93", Instant: "#ffcc00", Creature: "#ff3b30", Artifact: "#4cd964", Enchantment: "#34aadc", Planeswalker: "#5856d6", Sorcery: "#ff9500" }

        if (active) {

            const { payload, label, showCardLists, cardLists } = this.props;

            if (showCardLists) {
                return (
                    <div className="type-tooltip" >
                        <p className="label" style={{color: typeColorMap[label]}}>{`${label} : ${payload[0].value}`}</p>
                        <p className="hint">(Click to hide cards)</p>
                        {this.cardListToDivs(cardLists, label)}
                    </div>
                );
            } else {
                return (
                    <div className="type-tooltip">
                        <p className="label" style={{color: typeColorMap[label]}}>{`${label} : ${payload[0].value}`}</p>
                        <p className="hint">(Click to show cards)</p>
                    </div>
                );
            }
            
        }
        return null;
    };

    cardListToDivs(cardLists, label) {
        let cardList = cardLists[label]
        cardList.sort()
        if (cardList.length> 20) {
            let tableRows = []
            for (let i = 0; i < cardList.length - 1; i+= 2) {
                tableRows.push(<tr><td>{cardList[i]}</td><td>&nbsp;{cardList[i + 1]}</td></tr>)
            }
            if (cardList.length % 2 !== 0) {
                tableRows.push(<tr><td>{cardList[cardList.length - 1]}</td><td/></tr>)
            }

            return <table>{tableRows}</table>
        } else {
            return cardLists[label].map((card) => <div>{card}</div>)
        }
    }
}