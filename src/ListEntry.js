
import React from 'react';

export default class ListEntry extends React.Component {
    constructor(props) {
        super(props)
        this.card = this.props.card

        this.tcgURL = "https://www.tcgplayer.com/search/all/product?q=" + encodeURI(this.card.name)
        this.ckURL = "https://www.cardkingdom.com/catalog/search?search=header&filter%5Bname%5D=" + encodeURI(this.card.name)

        // TODO: dig deeper into the API and find out a way for direct links
        // or how to test to see if a direct link is bogus
        
        // this.escapedCardName = this.escapeString(this.card.name)

        // console.log(this.escapedCardName)

        // this.escapedSetName = this.escapeString(this.card.setName)

        // console.log(this.escapedSetName)

        // this.directCKUrl = "https://www.cardkingdom.com/mtg/" + this.escapedSetName + "/" + this.escapedCardName
        // if (this.card.modifier === "Foil") {
        //     this.directCKUrl += "-foil"
        // }
    }

    render() {
        return (
            <tr>
                <td>
                    <div style={{ textAlign: "left",  }}>
                        {(this.card.modifier === "Foil") ? "FOIL " : ""}{this.card.name} ({this.card.setCode.toUpperCase()})
                    </div>
                </td>
                <td>
                    <div style={{ textAlign: "left", paddingLeft: "10px" }}>
                        <a href={this.tcgURL} target="_blank">
                            {(this.card.tcgprice > 0) ? '$' + this.card.tcgprice : "No TCG Price"}
                        </a>
                    </div>
                </td>
                <td>
                    <div style={{ textAlign: "left", paddingLeft: "10px" }}>
                        <a href={this.ckURL} target="_blank">
                            {(this.card.ckprice > 0) ? '$' + this.card.ckprice : "No CK Price"}
                        </a>
                    </div>
                </td>
            </tr>
        );
    }

    // Replaces all ' with nothing and spaces with -
    // makes all characters lowercase
    escapeString(string) {
        string = string.toLowerCase()
        string = string.replace("//", "")
        string = string.replace(/,/g, "")
        string = string.replace(/'/g, "")
        string = string.replace(/ /g, "-")
        return string
    }
}