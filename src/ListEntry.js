
import React from 'react';
import './ListEntry.css'
// import { Tooltip } from 'reactstrap'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

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

        // Use https://www.seekpng.com/ima/u2w7w7w7w7a9e6e6/ for foil card overlay?

        this.state = { tooltipOpen: false }
    }

    render() {
        const toggle = () => this.setState({ tooltipOpen: !this.state.tooltipOpen });

        return (
            <tr>
                <td>
                    {(this.card.modifier === "Foil") ?
                        <div id="gradient" className="cell">
                            {/* <a id={"deck" + this.card.multiverseID} href={"http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=" + this.card.multiverseID} target="_blank">{this.card.name}</a> */}
                            {/* <Tooltip placement="right" isOpen={this.state.tooltipOpen} target={"deck" + this.card.multiverseID} toggle={toggle} style={{maxWidth:"300px", maxHeight: "400px", pointerEvents: 'none'}}>
                                {(this.card.multiverseID > 0) ? <img src={"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=" + this.card.multiverseID} alt={this.card.name} style={{width: "223px", height:"310px"}}/> : "No picture for this printing"}
                            </Tooltip> */}
                            {(this.card.multiverseID > 0) ? 
                            <OverlayTrigger 
                                placement="right"
                                delay={{ show: 250, hide: 100 }}
                                overlay={
                                    <Tooltip id={"deck" + this.card.multiverseID} className="tooltip">
                                        <img src={"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=" + this.card.multiverseID} alt={this.card.name} style={{ width: "223px", height: "310px", color: 'inherit' }} /> 
                                    </Tooltip>}
                            >
                                <a className="gradient" id={"deck" + this.card.multiverseID} href={"http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=" + this.card.multiverseID} target="_blank">{this.card.name}</a>
                            </OverlayTrigger> : this.card.name}
                        </div>
                        :
                        <div className="cell">
                            {/* <a id={"deck" + this.card.multiverseID} href={"http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=" + this.card.multiverseID} target="_blank">{this.card.name}</a> */}
                            {/* <Tooltip placement="right" isOpen={this.state.tooltipOpen} target={"deck" + this.card.multiverseID} toggle={toggle} style={{maxWidth:"300px", maxHeight: "400px", pointerEvents: 'none'}}>
                                {(this.card.multiverseID > 0) ? <img src={"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=" + this.card.multiverseID} alt={this.card.name} style={{width: "223px", height:"310px"}}/> : "No picture for this printing"}
                            </Tooltip> */}
                            {(this.card.multiverseID > 0) ? 
                            <OverlayTrigger 
                                placement="right"
                                delay={{ show: 250, hide: 0 }}
                                overlay={
                                    <Tooltip id={"deck" + this.card.multiverseID} className="tooltip">
                                        <img src={"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=" + this.card.multiverseID} alt={this.card.name} style={{ width: "223px", height: "310px", opacity: '1' }} /> 
                                    </Tooltip>}
                            >
                                <a id={"deck" + this.card.multiverseID} href={"http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=" + this.card.multiverseID} target="_blank">{this.card.name}</a>
                            </OverlayTrigger> : this.card.name}
                        </div>
                    }
                    <div style={{ textAlign: "left", paddingLeft: "10px" }}>

                    </div>
                </td>
                <td>
                    <div style={{ textAlign: "left", paddingLeft: "10px" }}>
                        {this.card.setCode.toUpperCase()}
                    </div>
                </td>
                <td>
                    <div style={{ textAlign: "left", paddingLeft: "10px" }}>
                        <a href={this.tcgURL} target="_blank">
                            {(this.card.tcgprice > 0) ? '$' + this.card.tcgprice : "No Price"}
                        </a>
                    </div>
                </td>
                <td>
                    <div style={{ textAlign: "left", paddingLeft: "10px" }}>
                        <a href={this.ckURL} target="_blank">
                            {(this.card.ckprice > 0) ? '$' + this.card.ckprice : "No Price"}
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