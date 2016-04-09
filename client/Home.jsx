var React = require('react');
var marked = require('marked');

var urls = require('./urls');

var Home = React.createClass({
    propTypes: {
    },
    render: function() {
        return (
            <div>
                <h1>Welcome to Kriegspiel!</h1>

                    <p> Kriegspiel is a variation of chess where you cannot see your opponents pieces. On a players turn they will suggest a
                        move and the game engine will determine if the move is valid based on the locations of the opponent's pieces.  If the move
                        is legal then the player's piece will be moved to the new location.  Otherwise the player will get to try a different move.
                        <ul>
                            <li>
                                Green Highlighting: last turn's move
                            </li>
                            <li>
                                Blue Highlighting: currently selected unit
                            </li>
                            <li>
                                Yellow Highlighting: possible pawn kills
                            </li>
                            <li>
                                Red Highlighting: Unit that was captured by opponent on the last round
                            </li>
                            <li>
                                Orange highlighting: Direction that King is currently in check from: (note knights will mark the diagonal)
                            </li>
                        </ul>

                        There is additional information
                        posted above the game board about the current state of the game.  For more information
                        on the game of kriegspiel visit these sites <a href="https://en.wikipedia.org/wiki/Kriegspiel_(chess)"> Wikipedia </a> <a href="http://www.chessvariants.com/incinf.dir/kriegspiel.html"> chessvariants.com </a>
                    </p>
            </div>
        );
    }
});

module.exports = Home;