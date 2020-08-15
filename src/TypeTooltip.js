import React from 'react';
import './TypeTooltip.css'


export default class TypeTooltip extends React.Component {

    render() {
        const { active } = this.props
        console.log(this.props)

        if (active) {

            const { payload, label, showCardLists, cardLists } = this.props;

            if (showCardLists) {
                return (
                    <div className="type-tooltip" >
                        <p className="label">{`${label} : ${payload[0].value}`}</p>
                        <p className="hint">(Click to hide cards)</p>
                        <p className="cards">{cardLists[label].map((card) => <div>{card}</div>)}</p>
                    </div>
                );
            } else {
                return (
                    <div className="type-tooltip">
                        <p className="label">{`${label} : ${payload[0].value}`}</p>
                        <p className="hint">(Click to show cards)</p>
                    </div>
                );
            }
            
        }
        return null;
    };


}