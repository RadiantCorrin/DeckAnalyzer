
import React from 'react';
import { Jumbotron, Card, CardBody, Button, Form, FormGroup, Input, Container, CardHeader, Spinner, Row, Col } from 'reactstrap';
import './App.css';
import archidekt from 'archidekt'
import ListEntry from './ListEntry';
import { BarChart, XAxis, YAxis, Bar, Tooltip, CartesianGrid, Label } from 'recharts';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, deckURL: null, loadError: false, loadingDeck: false };
    this.loadDeck = this.loadDeck.bind(this);
  }

  render() {
    return (
      <div>
        <Jumbotron style={{ height: 200 }}>
          <h1 className="display-10">Deck Analyzer</h1>
          <hr></hr>
          <p className="lead">A simple analysis tool for Magic: The Gathering decklists that are hosted on <a href="https://archidekt.com/">Archidekt</a> </p>
        </Jumbotron>

        {!this.state.loaded &&
          <Container fluid>
            <Card>
              <CardBody>
                <Form>
                  <FormGroup>
                    <Label for="deckURL">Deck URL</Label>
                    <Input
                      type="url"
                      name="url" id="inputURL"
                      placeholder="put your Archidekt URL here!"
                      onChange={e => this.setState({ deckURL: e.target.value })}>
                    </Input>
                  </FormGroup>
                </Form>

                <Button onClick={this.loadDeck}>Load</Button>

                <hr></hr>
                {!this.state.loadingDeck && !this.state.loaded &&
                  <Card>
                    <CardHeader>No deck loaded yet!</CardHeader>
                  </Card>}

                {this.state.loadError &&
                  <Card>
                    <CardHeader color="text-warning">Error loading decklist!</CardHeader>
                  </Card>}

                {this.state.loadingDeck &&
                  <Card>
                    <CardHeader>
                      <Spinner color="primary" />
                    </CardHeader>
                  </Card>}
              </CardBody>
            </Card>
          </Container>}

        {this.state.loaded &&
          <Container fluid>
            <Row>
              <Col style={{ marginLeft: 40, maxWidth: '20%', minWidth: 300 }}>
                <Card>
                  <CardHeader>Deck List and Price</CardHeader>
                </Card>
                <div style={{ display: 'block', maxWidth: '100%', maxHeight: 500, overflow: 'auto' }}>
                  {this.state.listOfCards}
                </div>
              </Col>
              <Col>
                <Container>
                  <Row>
                    <Col style={{ width: 550, height: 350, minWidth: 550, minHeight: 350}}>
                      <Card>
                        <CardHeader >
                          CMC Breakdown
                        </CardHeader>
                        <BarChart width={500} height={300} data={this.state.cmcData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="cmc">
                            <Label value="CMC" position="insideBottom" offset={-1}></Label>
                          </XAxis>
                          <YAxis label={{ value: 'Number of Cards', angle: -90, position: 'insideLeft' }}></YAxis>
                          <Tooltip />
                          <Bar dataKey="number" fill='#8884d8'></Bar>
                        </BarChart>
                      </Card>
                    </Col>
                    <Col style={{ width: 550, height: 350, minWidth: 550, minHeight: 350}}>
                      <Card>
                        <CardHeader>
                          Type Distribution
                      </CardHeader>
                        <BarChart width={500} height={300} data={this.state.typeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type">
                            <Label value="Type of Card" position="insideBottom" offset={-1}></Label>
                          </XAxis>
                          <YAxis label={{ value: 'Number of Cards', angle: -90, position: 'insideLeft' }}></YAxis>
                          <Tooltip />
                          <Bar dataKey="number" fill='#8884d8'></Bar>
                        </BarChart>
                      </Card>
                    </Col>
                  </Row>
                  <Row>
                    <Col style={{ width: 550, height: 350, minWidth: 550, minHeight: 350}}>
                      <CardHeader>
                        Color Breakdown
                      </CardHeader>
                      <BarChart width={500} height={300} data={this.state.cmcData}>
                        <XAxis dataKey="cmc"></XAxis>
                        <YAxis></YAxis>
                        <Tooltip />
                        <Bar dataKey="number" fill='#8884d8'></Bar>
                      </BarChart>
                    </Col>
                    <Col style={{ width: 550, height: 350, minWidth: 550, minHeight: 350}}>
                      <CardHeader>
                        Color Pip Distribution
                    </CardHeader>
                      <BarChart width={500} height={300} data={this.state.cmcData}>
                        <XAxis dataKey="cmc"></XAxis>
                        <YAxis></YAxis>
                        <Tooltip />
                        <Bar dataKey="number" fill='#8884d8'></Bar>
                      </BarChart>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>

        }

      </div>
    );
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

      for (let i = 0; i < jsonCards.length; i++) {
        // console.log("Converting card " + i)
        // console.log(jsonCards[i].card.prices)
        let tmp = new MTGCard(jsonCards[i].card.oracleCard.name,
          jsonCards[i].card.oracleCard.colors,
          jsonCards[i].card.oracleCard.manaCost,
          jsonCards[i].card.oracleCard.cmc,
          jsonCards[i].card.oracleCard.types,
          jsonCards[i].modifier,
          jsonCards[i].card.prices.tcg,
          jsonCards[i].card.prices.ck,
          jsonCards[i].card.edition.editioncode);


        // Add the CMC of this card to the raw values for the deck
        let key = "" + tmp.cmc
        if (key in cmcRawData) {
          cmcRawData[key] = cmcRawData[key] + 1
        } else {
          cmcRawData[key] = 1
        }

        // Add the types of this card to the raw values of the deck
        for (let i = 0; i < tmp.types.length; i++) {
          let type = tmp.types[i]
          console.log(type)
          if (type in typeRawData) {
            typeRawData[type] = typeRawData[type] + 1
          } else {
            typeRawData[type] = 1
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
        typeData.push({ type: key1, number: typeRawData[key1]})
      }

      // Map the JS cards to react elements, and store those elements in a list
      let list = jsCards.map(card => {
        return (
          <ListEntry card={card} />
        )
      })

      // Set the deck in the state
      this.setState({ deck: jsCards, listOfCards: list, loaded: true, loadingDeck: false, loadError: false, cmcData: cmcData, typeData: typeData })
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