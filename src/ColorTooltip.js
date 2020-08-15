import React from 'react';
import './ColorTooltip.css'

export default class ColorTooltip extends React.Component {
    render() {
        const { active } = this.props
        const colorMap = { Colorless: "#8e8e93", White: "#ffcc00", Blue: "#5ac8fa", Black: "#242526", Red: "#ff3b30", Green: "#4cd964", }

        if (active) {

            const { payload, label, showCardLists, cardLists } = this.props;

            if (showCardLists) {
                return (
                    <div className="color-tooltip" >
                        <p className="label" style={{color: colorMap[label]}}>{`${label} : ${payload[0].value}`}</p>
                        <p className="hint">(Click to hide cards)</p>
                        {this.cardListToDivs(cardLists, label)}
                    </div>
                );
            } else {
                return (
                    <div className="color-tooltip">
                        <p className="label" style={{color: colorMap[label]}}>{`${label} : ${payload[0].value}`}</p>
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
        if (cardList.length> 7) {
            let tableRows = []


            let numberOfColumns = Math.ceil(cardList.length / 7)
            console.log("The number of columns is: " + numberOfColumns)

            let numberOfRows = Math.ceil(cardList.length / numberOfColumns)



            let lastPivot = 0;
            for (let i = 0; i < numberOfRows; i++) {
                let thisRow = []
                for (let j = 0; j < numberOfColumns; j++) {
                    if (lastPivot + j < cardList.length) {
                        thisRow.push(<td>&nbsp;&nbsp;{cardList[lastPivot + j]}</td>)
                    }
                }
                lastPivot += numberOfColumns;
                tableRows.push(<tr>{thisRow}</tr>)
            }

            // for (let i = 0; i < cardList.length - 1; i+= 2) {
            //     tableRows.push(<tr><td>{cardList[i]}</td><td>{cardList[i + 1]}</td></tr>)
            // }
            // if (cardList.length % 2 !== 0) {
            //     tableRows.push(<tr><td>{cardList[cardList.length - 1]}</td><td/></tr>)
            // }

            return <table>{tableRows}</table>
        } else {
            return cardLists[label].map((card) => <div>{card}</div>)
        }
    }
}