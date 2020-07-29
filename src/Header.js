
import React from 'react'
import './Header.css'

export default class Title extends React.Component {
    render() {
        return (
            <div className="Header">
                <header>
                    <h1>Deck Analyzer</h1>
                    <hr></hr>
                    <div>
                        <p className="lead">A simple analysis tool for Magic: The Gathering decklists that are hosted on <a href="https://archidekt.com/">Archidekt</a></p> 
                    </div>
                </header>
            </div>
        )
    }

    /**
     * <Jumbotron style={{ height: 200 }}>
          <h1 className="display-10">Deck Analyzer</h1>
          <hr></hr>
          <p className="lead">A simple analysis tool for Magic: The Gathering decklists that are hosted on <a href="https://archidekt.com/">Archidekt</a> </p>
        </Jumbotron>
     */
}
