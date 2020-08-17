## Deck Analyzer
@author Corbin Modica

The Deck Analyzer is a single page web app that analyzes Magic: The Gathering decks.

Given a provided from the popular deck-hosting site [Archidekt](https://archidekt.com), the Analyzer read the decklist from that site, analyzes the deck, and provides rich charts with infromation about the deck, including converted mana cost breakdown, type breakdown, color breakdown, and more to help the user when they are building or refining their deck. It also contains statistic about the price of the cards in the deck, as price movements are of common interest to people prototyping decklists they haven't bought the cards for yet.

After being disapointed that no tool like this with all the features I wanted existed, I decided to teach myself React and build it myself.

A live version of the website can be accessed at [https://deck-analyzer.vercel.app/](https://deck-analyzer.vercel.app/).

Developement is ongoing! 

Planned features include:
* ~~A better decklist table, with interactive and sortable columns.~~
* Making the decklist table more visually appealing (column/row outlines?)
* ~~Show card previews on hover in decklist.~~
* ~~A list of cards on click for each bar and subar in each chart.~~
* Speed improvements, with a cleanup of the way the Analyzer puts information in the format that charts need.
* ~~Card images when hovering a card name in the decklist table.~~
* ~~Even more statistics!~~
* New welcome page.
