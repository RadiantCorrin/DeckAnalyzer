
import React from 'react';
import { Card, CardBody, Button, Form, FormGroup, Input, Container, CardHeader, Spinner } from 'reactstrap';
import './App.css';
import './container.css'
import archidekt from 'archidekt'
import ListEntry from './ListEntry';
import Header from './Header'
import axios from 'axios'
import { BarChart, XAxis, YAxis, Bar, Tooltip, CartesianGrid, Label, ResponsiveContainer, Cell } from 'recharts';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loaded: false, deckURL: null, loadError: false, loadingDeck: false, cmcIncludeLands: false, colorIncludeColorless: false, pipsIncludeColorless: false };
    this.loadDeck = this.loadDeck.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this)

    this.cmcIncludeLandsCheck = this.cmcIncludeLandsCheck.bind(this)
    this.colorIncludeColorlessCheck = this.colorIncludeColorlessCheck.bind(this)
    this.pipsIncludeColorlessCheck = this.pipsIncludeColorlessCheck.bind(this)
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
                  Currently, the Analyzer has only been tested with Commander decks. If your deck is not a Commander deck, the Analyzer may not work as intended!
                </p>
                <p>
                  You can use this link as an example, if you want: <a href="https://archidekt.com/decks/468872">https://archidekt.com/decks/468872</a>
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
              <div style={{ display: 'block', maxHeight: "65%", overflow: 'auto', border: "1px solid LightGray" }}>
                <table>
                  <tbody>
                    {this.state.listOfCards}
                  </tbody>
                </table>

              </div>
              <Card style={{ maxHeight: "25%", overflow: 'auto' }}>
                <p style={{ paddingLeft: "18px" }}><b>Stats:</b></p>
                <div>Total cost from TCGPlayer: <i style={{ color: 'green' }}>{"$" + this.state.TCGCost.toFixed(2)}</i></div>
                <div>Total cost from Card Kingdom: <i style={{ color: 'green' }}>{"$" + this.state.CKCost.toFixed(2)}</i></div>
                <div>Most expensive card from TCGPlayer: </div>
                <div><i style={{ color: 'green' }}>{this.state.TCGMax.name + " at $" + this.state.TCGMax.cost}</i></div>
                <div>Most expensive card from Card Kingdom:</div>
                <div><i style={{ color: 'green' }}>{this.state.CKMax.name + " at $" + this.state.CKMax.cost}</i></div>
              </Card>
            </div>
            <div className="boxone" style={{}}>
              <Card>
                <CardHeader >
                  <b>CMC Breakdown</b>
                </CardHeader>
              </Card>
              <ResponsiveContainer height="75%" width="95%">
                <BarChart data={(this.state.cmcIncludeLands) ? this.state.cmcData : this.state.cmcDataNoLands}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cmc">
                    <Label value="CMC" position="insideBottom" offset={-5}></Label>
                  </XAxis>
                  <YAxis label={{ value: 'Number of Cards', angle: -90, position: 'insideLeft' }}></YAxis>
                  <Tooltip />
                  {/* <Bar dataKey="number" fill='#110e5e'></Bar> */}
                  {/* <Bar dataKey="Land" stackId="a" fill="#15143b" />
                  <Bar dataKey="Instant" stackId="a" fill="#1e1c52" />
                  <Bar dataKey="Sorcery" stackId="a" fill="#312e87" />
                  <Bar dataKey="Creature" stackId="a" fill="#3d39a8" />
                  <Bar dataKey="Artifact" stackId="a" fill="#4944c7" />
                  <Bar dataKey="Enchantment" stackId="a" fill="#554fe3" />
                  <Bar dataKey="Planeswalker" stackId="a" fill="#5f59ff" /> */}
                  <Bar dataKey="Land" stackId="a" fill="#4f49bf" />
                  <Bar dataKey="Instant" stackId="a" fill="#4978bf" />
                  <Bar dataKey="Sorcery" stackId="a" fill="#49a9bf" />
                  <Bar dataKey="Creature" stackId="a" fill="#49bfab" />
                  <Bar dataKey="Artifact" stackId="a" fill="#49bf80" />
                  <Bar dataKey="Enchantment" stackId="a" fill="#49bf51" />
                  <Bar dataKey="Planeswalker" stackId="a" fill="#6ebf49" />
                </BarChart>
              </ResponsiveContainer>
              <form>
                <label>
                  <input type="checkbox" onChange={this.cmcIncludeLandsCheck} ></input>
                  {' '}Include Lands
                  </label>
              </form>
            </div>
            <div className="boxtwo">
              <Card>
                <CardHeader>
                  <b>Type Distribution</b>
                </CardHeader>
              </Card>
              <ResponsiveContainer height="75%" width="95%">
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
              <ResponsiveContainer height="75%" width="95%">
                <BarChart data={(this.state.colorIncludeColorless) ? this.state.colorDataWithColorless : this.state.colorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="color"></XAxis>
                  <YAxis></YAxis>
                  <Tooltip />
                  <Bar dataKey="number">
                    {
                      (this.state.colorIncludeColorless) ?
                        this.state.colorDataWithColorless.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={this.state.colors[entry.color]} />))
                        :
                        this.state.colorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={this.state.colors[entry.color]} />))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <form>
                <label>
                  <input type="checkbox" onChange={this.colorIncludeColorlessCheck} ></input>
                  {' '}Include Colorless
                  </label>
              </form>
            </div>
            <div className="boxfour">
              <Card>
                <CardHeader>
                  <b>Number of Colored Pips</b>
                </CardHeader>
              </Card>
              <ResponsiveContainer height="75%" width="95%">
                <BarChart data={(this.state.pipsIncludeColorless) ? this.state.pipsDataWithColorless : this.state.pipsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="color"></XAxis>
                  <YAxis></YAxis>
                  <Tooltip />
                  <Bar dataKey="number">
                    {
                      (this.state.pipsIncludeColorless) ?
                        this.state.pipsDataWithColorless.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={this.state.colors[entry.color]} />))
                        :
                        this.state.pipsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={this.state.colors[entry.color]} />))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <form>
                <label>
                  <input type="checkbox" onChange={this.pipsIncludeColorlessCheck} ></input>
                  {' '}Include Colorless Pips
                  </label>
              </form>
            </div>
          </div>
        }
      </div>
    );
  }

  cmcIncludeLandsCheck() {
    this.setState({ cmcIncludeLands: !this.state.cmcIncludeLands })
  }

  colorIncludeColorlessCheck() {
    this.setState({ colorIncludeColorless: !this.state.colorIncludeColorless })
  }

  pipsIncludeColorlessCheck() {
    this.setState({ pipsIncludeColorless: !this.state.pipsIncludeColorless })
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

    let axiosInstance = axios.create({
      baseURL: 'https://archidekt.com/api/'
    });

    // {headers: {"Access-Control-Allow-Origin": "*"}}
    axiosInstance.get('decks/' + number + "/", {header: {Cookie: "ID=12345"}}).then((response) => {


    // archidekt.fetchDeckById(number).then((response) => {
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
      let cmcRawDataNoLands = {}
      let typeRawData = {}
      let colorRawData = {}
      let numColorless = 0
      let pipsRawData = {}
      let numColorlessPips = 0

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
        // let key = "" + tmp.cmc
        // if (key in cmcRawData) {
        //   cmcRawData[key] = cmcRawData[key] + (1 * jsonCards[i].quantity)
        // } else {
        //   cmcRawData[key] = (1 * jsonCards[i].quantity)
        // }

        let cmcKey = "" + tmp.cmc
        if (cmcKey in cmcRawData) {
          if (tmp.types[0] in cmcRawData[cmcKey]) {
            cmcRawData[cmcKey][tmp.types[0]] = cmcRawData[cmcKey][tmp.types[0]] + (1 * jsonCards[i].quantity)
          } else {
            cmcRawData[cmcKey][tmp.types[0]] = (1 * jsonCards[i].quantity)
          }
        } else {
          cmcRawData[cmcKey] = {}
          cmcRawData[cmcKey][tmp.types[0]] = (1 * jsonCards[i].quantity)
        }

        // Add this card to the raw types for NONLANDS if this card is not a land
        if (!tmp.types.includes("Land")) {
          if (cmcKey in cmcRawDataNoLands) {
            if (tmp.types[0] in cmcRawDataNoLands[cmcKey]) {
              cmcRawDataNoLands[cmcKey][tmp.types[0]] = cmcRawDataNoLands[cmcKey][tmp.types[0]] + (1 * jsonCards[i].quantity)
            } else {
              cmcRawDataNoLands[cmcKey][tmp.types[0]] = (1 * jsonCards[i].quantity)
            }
          } else {
            cmcRawDataNoLands[cmcKey] = {}
            cmcRawDataNoLands[cmcKey][tmp.types[0]] = (1 * jsonCards[i].quantity)
          }
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
        // Make sure to count this card as colorless if it is! (lands don't count :) )
        if (tmp.colors.length === 0 && !tmp.types.includes("Land")) {
          numColorless++
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
            case "C":
              if (!tmp.types.includes("Land")) {
                numColorlessPips++
              }
              break
            default:
              break;
          }
        }

        jsCards.push(tmp)
      }

      // Put the CMC data in the form the charts need (objects)

      console.log(cmcRawData)

      let cmcData = []
      for (var key in cmcRawData) {
        let pushMe = cmcRawData[key]
        pushMe["cmc"] = key
        cmcData.push(pushMe)
      }

      // Put the CMC data in the form the charts need (objects)
      let cmcDataNoLands = []
      for (var keyNoLands in cmcRawDataNoLands) {
        let pushMe = cmcRawDataNoLands[keyNoLands]
        pushMe["cmc"] = keyNoLands
        cmcDataNoLands.push(pushMe)
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

      // Create a color data set that also includes the colorless nonland cards

      // let colorDataWithColorless = []
      let colorDataWithColorless = JSON.parse(JSON.stringify(colorData))
      if (numColorless > 0) {
        colorDataWithColorless.push({ color: "Colorless", number: numColorless })
      }

      // Put the pip data in the form for the charts
      // 38e051
      let colorMap = { Colorless: "#d7d8db", White: "#eaebd1", Blue: "#4287f5", Black: "#242526", Red: "#de2f2f", Green: "#009c3c", }
      let pipsData = []
      for (var key3 in pipsRawData) {
        pipsData.push({ color: key3, number: pipsRawData[key3] })
      }

      // Create the dataset that includes colorless cards
      let pipsDataWithColorless = JSON.parse(JSON.stringify(pipsData))
      if (numColorlessPips > 0)
        pipsDataWithColorless.push({ color: 'Colorless', number: numColorlessPips })

      // Map the JS cards to react elements, and store those elements in a list. This list
      // will be
      let list = jsCards.map(card => {
        return (
          <ListEntry card={card} />
        )
      })

      // console.log(colorData)
      // console.log(colorDataWithColorless)


      // console.log(colorMap["Colorless"])

      // Store all of the analysis data in the state for the other components to use
      this.setState({
        deck: jsCards, listOfCards: list, loaded: true, loadingDeck: false, loadError: false,
        cmcData: cmcData, cmcDataNoLands: cmcDataNoLands, typeData: typeData, colorData: colorData, pipsData: pipsData,
        TCGCost: tcgTotalCost, CKCost: ckTotalCost, TCGMax: maxTCG, CKMax: maxCK,
        colors: colorMap, colorDataWithColorless: colorDataWithColorless, pipsDataWithColorless: pipsDataWithColorless
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