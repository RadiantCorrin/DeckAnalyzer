
import React from 'react';
import { Jumbotron, Card, CardBody, Button, Form, FormGroup, Input, Container, CardHeader, Spinner, Row, Col, CardText } from 'reactstrap';
import './App.css';
import archidekt from 'archidekt'
import ListEntry from './ListEntry';
import Header from './Header'
import { BarChart, XAxis, YAxis, Bar, Tooltip, CartesianGrid, Label } from 'recharts';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, deckURL: null, loadError: false, loadingDeck: false };
    this.loadDeck = this.loadDeck.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  render() {
    return (
      <div>
        <Header />

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

        {this.state.loaded &&
          <Container fluid>
            <Row>
              <Col style={{ marginLeft: 40, maxWidth: '30%', minWidth: 300 }}>
                <Card>
                  <CardHeader><b>Deck List and Price (TCG, CK)</b></CardHeader>
                </Card>
                <div style={{ display: 'block', maxWidth: '100%', maxHeight: 475, overflow: 'auto' }}>
                  {this.state.listOfCards}
                </div>
                <Card>
                    <p><b>Stats:</b></p>
                    <div>Total cost from TCGPlayer: <i>{"$" + this.state.TCGCost.toFixed(2)}</i></div>
                    <div>Total cost from Card Kingdom: <i>{"$" + this.state.CKCost.toFixed(2)}</i></div>
                    <div>Most expensive card from TCGPlayer: </div>
                    <div><i>{this.state.TCGMax.name + " at $" + this.state.TCGMax.cost}</i></div>
                    <div>Most expensive card from Card Kingdom:</div>
                    <div><i>{this.state.CKMax.name + " at $" + this.state.CKMax.cost}</i></div>
                </Card>
              </Col>
              <Col>

                <Row>
                  <Col xs="auto">
                    <Card style={{ width: 550, height: 370, minWidth: 550, minHeight: 360 }}>
                      <CardHeader >
                        <b>CMC Breakdown</b>
                        </CardHeader>
                      <BarChart width={500} height={300} data={this.state.cmcData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="cmc">
                          <Label value="CMC" position="insideBottom" offset={-5}></Label>
                        </XAxis>
                        <YAxis label={{ value: 'Number of Cards', angle: -90, position: 'insideLeft' }}></YAxis>
                        <Tooltip />
                        <Bar dataKey="number" fill='#8884d8'></Bar>
                      </BarChart>
                      <CardBody>Include lands?</CardBody>
                    </Card>
                  </Col>
                  <Col xs="auto">
                    <Card style={{ width: 550, height: 370, minWidth: 550, minHeight: 360 }}>
                      <CardHeader>
                        <b>Type Distribution</b>
                      </CardHeader>
                      <BarChart width={500} height={300} data={this.state.typeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type">
                          <Label value="Card Type" position="insideBottom" offset={-5}></Label>
                        </XAxis>
                        <YAxis label={{ value: 'Number of Cards', angle: -90, position: 'insideLeft' }}></YAxis>
                        <Tooltip />
                        <Bar dataKey="number" fill='#1ab886'></Bar>
                      </BarChart>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col xs="auto">
                    <Card style={{ width: 550, height: 350, minWidth: 550, minHeight: 350 }}>
                      <CardHeader>
                        <b>Color Breakdown</b>
                      </CardHeader>
                      <BarChart width={500} height={300} data={this.state.colorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="color"></XAxis>
                        <YAxis></YAxis>
                        <Tooltip />
                        <Bar dataKey="number" fill='#4b71db'></Bar>
                      </BarChart>
                    </Card>
                  </Col>
                  <Col xs="auto">
                    <Card style={{ width: 550, height: 350, minWidth: 550, minHeight: 350 }}>
                      <CardHeader>
                        <b>Color Pip Distribution</b>
                      </CardHeader>
                      <BarChart width={500} height={300} data={this.state.pipsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="color"></XAxis>
                        <YAxis></YAxis>
                        <Tooltip />
                        <Bar dataKey="number" fill='#ed6666'></Bar>
                      </BarChart>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>

        }
        <hr></hr>
      </div>
    );
  }

  // Allows enter to submit the form, and prevents the page from refreshing.
  handleKeyPress(event) {
    event.preventDefault()
    this.loadDeck()
  }

  loadDeck() {
    let jsonDeck = null

    // Read in the deck with a lookup, which is an Axios promise
    // Gotta wait for it to be done to do anything

    // console.log("The URL I got was:" + this.state.deckURL)

    if (this.state.deckURL == null || "") {
      console.log("Null/empty URL on call")
      return
    }

    let urlParts = this.state.deckURL.split("/")

    if (urlParts.length < 5) {
      console.log("Error parsing URL")
      return;
    }

    let nameAndNumber = urlParts[4]
    let nameAndNumberParts = nameAndNumber.split("#")

    // The unique ID for an archidekt deck. Needed for lookup
    let number = parseInt(nameAndNumberParts[0])

    // console.log(urlParts)
    // console.log(number)

    // Start loading the deck
    this.setState({ loadingDeck: true })

    // Fetch the deck, and start analysis
    archidekt.fetchDeckById(number).then((response) => {
      jsonDeck = response

      this.setState({ loadingDeck: true })

      // If there is some error fetching the deck, set the state and exit
      if (jsonDeck == null) {
        this.setState({ loadError: true, loadDeck: false })
        this.console.log("Error loading deck!")
        return
      }

      // Extract 
      let jsonCards = jsonDeck.data.cards
      console.log(jsonCards)

      let jsCards = []

      let cmcRawData = {}
      let typeRawData = {}
      let colorRawData = {}
      let pipsRawData = {}

      let tcgTotalCost = 0
      let ckTotalCost = 0
      let maxTCG = null
      let maxCK = null

      for (let i = 0; i < jsonCards.length; i++) {
        // TODO 
        // Change the price from the prices array based on whether or not this card is foil :)

        /**
         * prices:
          ck: 0.25
          ckfoil: 0.99
          cm: 0.11
          cmfoil: 0.06
          mtgo: 0.03
          mtgofoil: 0.77
          tcg: 0.12
          tcgfoil: 0.43
        */

        // Skip all cards in the MAYBEBOARD Category by default
        if (jsonCards[i].category === "Maybeboard") {
          continue
        }

        let tmpTCGPrice = (jsonCards[i].modifier === "Foil") ? jsonCards[i].card.prices.tcgfoil : jsonCards[i].card.prices.tcg;
        let tmpCKPRice = (jsonCards[i].modifier === "Foil") ? jsonCards[i].card.prices.ckfoil : jsonCards[i].card.prices.ck;

        tcgTotalCost += tmpTCGPrice * jsonCards[i].quantity
        ckTotalCost += tmpCKPRice * jsonCards[i].quantity

        // These could be merged, but I think it is more readable with seperate cases
        if (maxTCG == null) {
          maxTCG = {name: jsonCards[i].card.oracleCard.name, cost: tmpTCGPrice}
        } else if (maxTCG.cost < tmpTCGPrice) {
          maxTCG = {name: jsonCards[i].card.oracleCard.name, cost: tmpTCGPrice}
        }

        if (maxCK == null) {
          maxCK = {name: jsonCards[i].card.oracleCard.name, cost: tmpCKPRice}
        } else if (maxCK.cost < tmpCKPRice) {
          maxCK = {name: jsonCards[i].card.oracleCard.name, cost: tmpCKPRice}
        }

        let tmp = new MTGCard(jsonCards[i].card.oracleCard.name,
          jsonCards[i].card.oracleCard.colors,
          jsonCards[i].card.oracleCard.manaCost,
          jsonCards[i].card.oracleCard.cmc,
          jsonCards[i].card.oracleCard.types,
          jsonCards[i].modifier,
          tmpTCGPrice,
          tmpCKPRice,
          jsonCards[i].card.edition.editioncode);


        // Add the CMC of this card to the raw values for the deck
        let key = "" + tmp.cmc
        if (key in cmcRawData) {
          cmcRawData[key] = cmcRawData[key] + 1
        } else {
          cmcRawData[key] = 1
        }

        // Add the types of this card to the raw values of the deck
        // TODO: if a card has more than 1 (aka, is a basic land or something) 
        //       then we need to add that type TIMES the quanitity of the card
        for (let j = 0; j < tmp.types.length; j++) {
          console.log(jsonCards[i].card.oracleCard.name + jsonCards[i].quantity)
          let type = tmp.types[j]
          if (type in typeRawData) {
            typeRawData[type] = typeRawData[type] + (1 * jsonCards[i].quantity)
          } else {
            typeRawData[type] = (1 * jsonCards[i].quantity)
          }
        }

        // Add the colors of this card to the list
        for (let j = 0; j < tmp.colors.length; j++) {
          let color = tmp.colors[j]
          if (color in colorRawData) {
            colorRawData[color] = colorRawData[color] + 1
          } else {
            colorRawData[color] = 1
          }
        }

        // TODO: what is the character symbol for colorless?
        // Count the actual symbols
        for (let j = 0; j < tmp.manaCost.length; j++) {
          let ch = tmp.manaCost.charAt(j)

          if (ch === "W") {
            if ("White" in pipsRawData) {
              pipsRawData["White"]++
            } else {
              pipsRawData["White"] = 1
            }
          } else if (ch === "U") {
            if ("Blue" in pipsRawData) {
              pipsRawData["Blue"]++
            } else {
              pipsRawData["Blue"] = 1
            }
          } else if (ch === "B") {
            if ("Black" in pipsRawData) {
              pipsRawData["Black"]++
            } else {
              pipsRawData["Black"] = 1
            }
          } else if (ch === "R") {
            if ("Red" in pipsRawData) {
              pipsRawData["Red"]++
            } else {
              pipsRawData["Red"] = 1
            }
          } else if (ch === "G") {
            if ("Green" in pipsRawData) {
              pipsRawData["Green"]++
            } else {
              pipsRawData["Green"] = 1
            }
          }
        }



        jsCards.push(tmp)
      }

      // Put the CMC data in the form the charts need
      let cmcData = []
      for (var key in cmcRawData) {
        cmcData.push({ cmc: key, number: cmcRawData[key] })
      }

      console.log(typeRawData)

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

      // Put the color data in the form for the charts
      let pipsData = []
      for (var key3 in pipsRawData) {
        pipsData.push({ color: key3, number: pipsRawData[key3] })
      }

      // Map the JS cards to react elements, and store those elements in a list
      let list = jsCards.map(card => {
        return (
          <ListEntry card={card} />
        )
      })

      /**
       * <p>Total Cost from TCGPlayer: {this.state.TCGCost}</p>
                    <p>Total Cost from Card Kingdom: {this.state.CKCost}</p>
                    <p>Most Expensive card from TCGPlayer: {this.state.TCGMax}</p>
                    <p>Most Expensive card from Card Kingdom: {this.state.CKMax}</p>
       */

      // Set the deck in the state
      this.setState({ deck: jsCards, listOfCards: list, loaded: true, loadingDeck: false, loadError: false, 
        cmcData: cmcData, typeData: typeData, colorData: colorData, pipsData: pipsData,
        TCGCost: tcgTotalCost, CKCost: ckTotalCost, TCGMax: maxTCG, CKMax: maxCK })
    });
  }
};

class MTGCard {
  constructor(name, colors, manaCost, cmc, types, modifier, tcgprice, ckprice, set) {
    // The name of the card
    this.name = name

    // The colors that the card is
    this.colors = colors

    // The mana cost of this card
    this.manaCost = manaCost

    // The cmc of this card
    this.cmc = cmc;

    this.types = types;

    // "Normal" for cards that arent foil, "Foil" for cards that are foil
    this.modifier = modifier

    /**
     * prices:
        ck: 0.25
        ckfoil: 0.99
        cm: 0.11
        cmfoil: 0.06
        mtgo: 0.03
        mtgofoil: 0.77
        tcg: 0.12
        tcgfoil: 0.43
     */
    this.tcgprice = tcgprice
    this.ckprice = ckprice

    this.set = set;
  }

  displayInConsole() {
    console.log("{ name: " + this.name + ", colors: " + this.colors + ", manaCost: " + this.manaCost + ", type: " + this.modifier + ", TCGPlayer price: " + this.tcgprice + ", Card Kingdom price: " + this.ckprice);
  }
}