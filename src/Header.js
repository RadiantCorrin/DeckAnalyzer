
import React from 'react'
import './Header.css'

export default class Title extends React.Component {
    constructor(props) {
        super(props);

        this.state = { deckURL: props.deckURL, deckName: props.deckName, mode: props.mode }
    }

    render() {
        return (
            <div className="Header">
                <header>
                    <h1>Deck Analyzer</h1>
                    <hr style={{width: "100%"}}></hr>
                    {
                        (this.state.mode === "Welcome") && 
                        <div>
                            <p className="lead">A simple analysis tool for Magic: The Gathering decklists that are hosted on <a href="https://archidekt.com/" target="_blank">Archidekt</a></p>
                        </div>
                    }
                    {
                        (this.state.mode === "Loaded") && 
                        <div>
                            <p className="lead">Now displaying <a href={this.state.deckURL} target="_blank">{this.state.deckName}</a></p>
                        </div>
                    }
                </header>
            </div>
        )
    }
}
