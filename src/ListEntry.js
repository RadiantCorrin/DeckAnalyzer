
import React from 'react';
import { Card } from 'reactstrap';

export default class ListEntry extends React.Component {
    constructor(props) {
        super(props)
        this.card = this.props.card
    }

    /// {(this.card.price === "0") ? '$' + this.card.tcgprice : "No Price"}
    render() {
        return (
            <Card>
                <table>
                    <tr>
                        <td><div style={{ }}>
                            {(this.card.modifier === "Foil") ? "FOIL " : ""}{this.card.name} ({this.card.set.toUpperCase()})
                        </div></td>
                        <td><div style={{ textAlign: 'right' }}>
                            {(this.card.tcgprice > 0) ? '$' + this.card.tcgprice : "No TCG Price"}{(this.card.ckprice > 0) ? ', $' + this.card.ckprice : ", No CK Price"}
                        </div></td>
                    </tr>
                </table>
            </Card>
        );
    }
}