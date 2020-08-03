
import React from 'react';
import { Jumbotron, Card, CardBody, Button, Form, FormGroup, Input, Container, CardHeader, Spinner, Row, Col, CardText } from 'reactstrap';
import './App.css';
import './container.css'
import archidekt from 'archidekt'
import ListEntry from './ListEntry';
import Header from './Header'
import { BarChart, XAxis, YAxis, Bar, Tooltip, CartesianGrid, Label, ResponsiveContainer, Cell } from 'recharts';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loaded: false, deckURL: null, loadError: false, loadingDeck: false };
    this.loadDeck = this.loadDeck.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  render() {
    return (
      <div style={{ height: '100vh', width: "100vw" }}>
        {/* The header for the website when nothing is loaded */}
        {!this.state.loaded && <Header />}

        {/* The welcome page of the analyzer. */}
        {!this.state.loaded &&
          <Container fluid>
            <Card>
              <CardBody>
                <p>
                  Just put the URL to your deck below, and the Analyzer will display information about it!
                </p>
                <p>
                  Right now, the Analyzer was designed for Commander decks. If your deck is not a Commander deck, the Analyzer may not work as intended.
                </p>
                <Form onSubmit={this.handleKeyPress}>
                  <FormGroup>
                    <Label for="deckURL">Deck URL</Label>
                    <Input
                      type="url"
                      name="url" id="inputURL"
                      placeholder="Archidekt URL goes here"
                      onChange={e => this.setState({ deckURL: e.target.value })}>
                    </Input>
                  </FormGroup>
                </Form>

                {!this.state.loadingDeck && <Button onClick={this.loadDeck}>Load</Button>}

                {this.state.loadError &&
                  <Card>
                    <CardHeader color="text-warning">Error loading decklist!</CardHeader>
                  </Card>}

                {this.state.loadingDeck && <Spinner color="primary" />}
              </CardBody>
            </Card>
          </Container>}

        {/* The information display for after the deck has been loaded / analyzed */}
        {this.state.loaded &&
          <div className="customContainer">
            <div className="header">
              <Header />
            </div>
            <div className="sidebar" style={{ minWidth: "375px" }}>
              <Card style={{ maxHeight: '10%' }}>
                <CardHeader><b>Deck List and Price (TCG, CK)</b></CardHeader>
              </Card>
              <div style={{ display: 'block', maxHeight: "65%", overflow: 'auto' }}>
                <table>
                  <tbody>
                    {this.state.listOfCards}
                  </tbody>
                </table>
                
              </div>
              <Card style={{ maxHeight: "25%", overflow: 'auto' }}>
                <p><b>Stats:</b></p>
                <div>Total cost from TCGPlayer: <i style={{ color: 'blue' }}>{"$" + this.state.TCGCost.toFixed(2)}</i></div>
                <div>Total cost from Card Kingdom: <i style={{ color: 'blue' }}>{"$" + this.state.CKCost.toFixed(2)}</i></div>
                <div>Most expensive card from TCGPlayer: </div>
                <div><i style={{ color: 'blue' }}>{this.state.TCGMax.name + " at $" + this.state.TCGMax.cost}</i></div>
                <div>Most expensive card from Card Kingdom:</div>
                <div><i style={{ color: 'blue' }}>{this.state.CKMax.name + " at $" + this.state.CKMax.cost}</i></div>
              </Card>
            </div>
            <div className="boxone" style={{}}>
              <Card>
                <CardHeader >
                  <b>CMC Breakdown</b>
                </CardHeader>
              </Card>
              <ResponsiveContainer height="85%" width="95%">
                <BarChart data={this.state.cmcData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cmc">
                    <Label value="CMC" position="insideBottom" offset={-5}></Label>
                  </XAxis>
                  <YAxis label={{ value: 'Number of Cards', angle: -90, position: 'insideLeft' }}></YAxis>
                  <Tooltip />
                  <Bar dataKey="number" fill='#8884d8'></Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="boxtwo">
              <Card>
                <CardHeader>
                  <b>Type Distribution</b>
                </CardHeader>
              </Card>
              <ResponsiveContainer height="85%" width="95%">
                <BarChart data={this.state.typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type">
                    <Label value="Card Type" position="insideBottom" offset={-5}></Label>
                  </XAxis>
                  <YAxis label={{ value: 'Number of Cards', angle: -90, position: 'insideLeft' }}></YAxis>
                  <Tooltip />
                  <Bar dataKey="number" fill='#1ab886'></Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="boxthree">
              <Card>
                <CardHeader>
                  <b>Color Breakdown</b>
                </CardHeader>
              </Card>
              <ResponsiveContainer height="85%" width="95%">
                <BarChart data={this.state.colorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="color"></XAxis>
                  <YAxis></YAxis>
                  <Tooltip />
                  <Bar dataKey="number">
                  {
                    this.state.colorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={this.state.colors[entry.color]} />
                    ))
                  }
                  </Bar>
                  
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="boxfour">
              <Card>
                <CardHeader>
                  <b>Number of Colored Pips</b>
                </CardHeader>
              </Card>
              <ResponsiveContainer height="85%" width="95%">
                <BarChart data={this.state.pipsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="color"></XAxis>
                  <YAxis></YAxis>
                  <Tooltip />
                  <Bar dataKey="number">
                  {
                    this.state.pipsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={this.state.colors[entry.color]} />
                    ))
                  }
                  </Bar>
                  
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        }
      </div>
    );
  }

  /**
   * A small helper method that stops the form from reloading the page and submitting in
   * the normal way, and instead calls the native deck loading function
   * @param {The action the user is triggering} event 
   */
  handleKeyPress(event) {
    event.preventDefault()
    this.loadDeck()
  }

  /**
   * Loads the decklist from the URL the user provides, and does analysis of
   * the deck for the other components to display.
   */
  loadDeck() {
    let jsonDeck = null

    // If no valid url is found, don't try loading!
    if (this.state.deckURL == null || "") {
      console.log("Null/empty URL on call")
      return
    }

    // Split out the parts of the URL that are separated by slashes
    let urlParts = this.state.deckURL.split("/")
    if (urlParts.length < 5) {
      console.log("Error parsing URL")
      return;
    }

    let nameAndNumber = urlParts[4]
    let nameAndNumberParts = nameAndNumber.split("#")

    // The unique ID for an archidekt deck. Needed for lookup
    let number = parseInt(nameAndNumberParts[0])

    // Update state so we can start loading the deck
    this.setState({ loadingDeck: true })

    // Read in the deck with a lookup, which is an Axios promise
    // Gotta wait for it to be done to do anything
    archidekt.fetchDeckById(number).then((response) => {
      jsonDeck = response

      // If there is some error fetching the deck, set the state and exit
      if (jsonDeck == null) {
        this.setState({ loadError: true, loadDeck: false, loadingDeck: false })
        this.console.log("Error loading deck!")
        return
      }

      // Extract the actual json object that holds all the cards
      let jsonCards = jsonDeck.data.cards
      console.log(jsonCards)

      // Set up variables to be used to track information about the cards that were loaded
      let jsCards = []

      let cmcRawData = {}
      let typeRawData = {}
      let colorRawData = {}
      let pipsRawData = {}

      let tcgTotalCost = 0
      let ckTotalCost = 0
      let maxTCG = null
      let maxCK = null

      // For each card, parse all the information we need from it
      for (let i = 0; i < jsonCards.length; i++) {
        // Skip all cards in the MAYBEBOARD Category by default
        if (jsonCards[i].category === "Maybeboard") {
          continue
        }

        // Get the price for TCGPlayer and CK, depending on wether the card is foil or not 
        let tmpTCGPrice = (jsonCards[i].modifier === "Foil") ? jsonCards[i].card.prices.tcgfoil : jsonCards[i].card.prices.tcg;
        let tmpCKPRice = (jsonCards[i].modifier === "Foil") ? jsonCards[i].card.prices.ckfoil : jsonCards[i].card.prices.ck;

        // Increase the cost by the quantity
        tcgTotalCost += tmpTCGPrice * jsonCards[i].quantity
        ckTotalCost += tmpCKPRice * jsonCards[i].quantity

        // Compare this card's price to the max we have seen so far, updating if needed
        // These could be merged, but I think it is more readable with seperate cases
        if (maxTCG == null) {
          maxTCG = { name: jsonCards[i].card.oracleCard.name, cost: tmpTCGPrice }
        } else if (maxTCG.cost < tmpTCGPrice) {
          maxTCG = { name: jsonCards[i].card.oracleCard.name, cost: tmpTCGPrice }
        }
        // Same with CK
        if (maxCK == null) {
          maxCK = { name: jsonCards[i].card.oracleCard.name, cost: tmpCKPRice }
        } else if (maxCK.cost < tmpCKPRice) {
          maxCK = { name: jsonCards[i].card.oracleCard.name, cost: tmpCKPRice }
        }

        // Create the custom JavaScript object to hold all of this card's data
        let tmp = new MTGCard(jsonCards[i].card.oracleCard.name,
          jsonCards[i].card.oracleCard.colors,
          jsonCards[i].card.oracleCard.manaCost,
          jsonCards[i].card.oracleCard.cmc,
          jsonCards[i].card.oracleCard.types,
          jsonCards[i].modifier,
          tmpTCGPrice,
          tmpCKPRice,
          jsonCards[i].card.edition.editioncode,
          jsonCards[i].card.edition.editionname
          );


        // Add the CMC of this card to the raw values for the deck
        let key = "" + tmp.cmc
        if (key in cmcRawData) {
          cmcRawData[key] = cmcRawData[key] + 1
        } else {
          cmcRawData[key] = 1
        }

        // Add the types of this card to the raw values of the deck
        for (let j = 0; j < tmp.types.length; j++) {
          let type = tmp.types[j]
          if (type in typeRawData) {
            typeRawData[type] = typeRawData[type] + (1 * jsonCards[i].quantity)
          } else {
            typeRawData[type] = (1 * jsonCards[i].quantity)
          }
        }

        // TODO: Needs support for colorless cards
        // Add the colors of this card to the tracker for those in the deck
        for (let j = 0; j < tmp.colors.length; j++) {
          let color = tmp.colors[j]
          if (color in colorRawData) {
            colorRawData[color] = colorRawData[color] + 1
          } else {
            colorRawData[color] = 1
          }
        }

        // TODO: Needs support for colorless mana symbols
        // Parse the pip color symbols for this card and add them to the trackers
        for (let j = 0; j < tmp.manaCost.length; j++) {
          let ch = tmp.manaCost.charAt(j)

          // Match the manacost character to the name of the color it belongs to
          // and increment the count in the corresponding data entry
          // eslint-disable-next-line default-case
          switch (ch) {
            case "W":
              if ("White" in pipsRawData) {
                pipsRawData["White"]++
              } else {
                pipsRawData["White"] = 1
              }
              break;
            case "U":
              if ("Blue" in pipsRawData) {
                pipsRawData["Blue"]++
              } else {
                pipsRawData["Blue"] = 1
              }
              break;
            case "B":
              if ("Black" in pipsRawData) {
                pipsRawData["Black"]++
              } else {
                pipsRawData["Black"] = 1
              }
              break;
            case "R":
              if ("Red" in pipsRawData) {
                pipsRawData["Red"]++
              } else {
                pipsRawData["Red"] = 1
              }
              break;
            case "G":
              if ("Green" in pipsRawData) {
                pipsRawData["Green"]++
              } else {
                pipsRawData["Green"] = 1
              }
              break;
            default:
              break;
          }

          // if (ch === "W") {
          //   if ("White" in pipsRawData) {
          //     pipsRawData["White"]++
          //   } else {
          //     pipsRawData["White"] = 1
          //   }
          // } else if (ch === "U") {
          //   if ("Blue" in pipsRawData) {
          //     pipsRawData["Blue"]++
          //   } else {
          //     pipsRawData["Blue"] = 1
          //   }
          // } else if (ch === "B") {
          //   if ("Black" in pipsRawData) {
          //     pipsRawData["Black"]++
          //   } else {
          //     pipsRawData["Black"] = 1
          //   }
          // } else if (ch === "R") {
          //   if ("Red" in pipsRawData) {
          //     pipsRawData["Red"]++
          //   } else {
          //     pipsRawData["Red"] = 1
          //   }
          // } else if (ch === "G") {
          //   if ("Green" in pipsRawData) {
          //     pipsRawData["Green"]++
          //   } else {
          //     pipsRawData["Green"] = 1
          //   }
          // }
        }

        jsCards.push(tmp)
      }

      // Put the CMC data in the form the charts need (objects)
      let cmcData = []
      for (var key in cmcRawData) {
        cmcData.push({ cmc: key, number: cmcRawData[key] })
      }

      // Put the type data in the form that the charts need
      let typeData = []
      for (var key1 in typeRawData) {
        typeData.push({ type: key1, number: typeRawData[key1] })
      }

      // Put the color data in the form for the charts
      let colorData = []
      for (var key2 in colorRawData) {
        colorData.push({ color: key2, number: colorRawData[key2] })
      }

      // Put the pip data in the form for the charts
      let colorMap = {White: "#eaebd1", Blue: "#4287f5", Black: "#242526", Red: "#de2f2f", Green: "#38e051"}
      let pipsData = []
      for (var key3 in pipsRawData) {
        pipsData.push({ color: key3, number: pipsRawData[key3] })
      }

      // Map the JS cards to react elements, and store those elements in a list. This list
      // will be
      let list = jsCards.map(card => {
        return (
          <ListEntry card={card} />
        )
      })

      // Store all of the analysis data in the state for the other components to use
      this.setState({
        deck: jsCards, listOfCards: list, loaded: true, loadingDeck: false, loadError: false,
        cmcData: cmcData, typeData: typeData, colorData: colorData, pipsData: pipsData,
        TCGCost: tcgTotalCost, CKCost: ckTotalCost, TCGMax: maxTCG, CKMax: maxCK,
        colors: colorMap
      })
    });
  }
};

/**
 * A class that represents all the information we need about MTGCards in
 * beautiful, JavaScript object form :)
 */
class MTGCard {
  constructor(name, colors, manaCost, cmc, types, modifier, tcgprice, ckprice, setCode, setName) {
    this.name = name          // The name of the card
    this.colors = colors      // The colors that the card is
    this.manaCost = manaCost  // The mana cost of this card
    this.cmc = cmc;           // The cmc of this card
    this.types = types;       // An array of all the types this card has
    this.modifier = modifier  // "Normal" for cards that arent foil, "Foil" for cards that are foil
    this.tcgprice = tcgprice  // The price at TCGPlayer for this card and condition
    this.ckprice = ckprice    // The price at Card Kingdom for this card and condition
    this.setCode = setCode;   // The set code for the expansion this card is from
    this.setName = setName;   // The name of the set that this card is from
  }

  /**
   * A Small helper function that prints from relevant information about this card, for
   * debugging purposes.
   */
  displayInConsole() {
    console.log("{ name: " + this.name + ", colors: " + this.colors + ", manaCost: " + this.manaCost + ", type: " + this.modifier + ", TCGPlayer price: " + this.tcgprice + ", Card Kingdom price: " + this.ckprice);
  }
}