
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
                <header style={ (this.state.mode === "Welcome") ? { }: { height: '95%'} } >
                    {
                        (this.state.mode === "Welcome") && 
                        <h1 >Deck Analyzer</h1>
                    }
                    {
                        (this.state.mode === "Loaded") &&
                        <div>
                            <h1 >Deck Analyzer</h1>
                        <hr style={{width: "100%"}}></hr>
                        <div>
                            <p className="lead">Now displaying <a href={this.state.deckURL} target="_blank" rel='noopener noreferrer'>{this.state.deckName}</a></p>
                        </div>
                        </div>
                        
                    }
                </header>
            </div>
        )
    }
}
