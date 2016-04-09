/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var Well = require('react-bootstrap').Well;

var MainNav = require('./MainNav');
var CommentList = require('./CommentList');
var GamePage = require('./GamePage');
var UserInfo = require('./UserInfo');
var AI = require('./AI');
var MatchMaking = require('./MatchMaking');


var InterfaceComponent = React.createClass({
    componentWillMount : function() {
        this.callback = (function() {
            this.forceUpdate();
        }).bind(this);

        this.props.router.on("route", this.callback);
    },
    componentWillUnmount : function() {
        this.props.router.off("route", this.callback);
    },
    render: function() {
        var nav = 0;
        var content;
        if (this.props.router.current[0] == 'home') {
            nav = 1;
            content = (
                <Well>
                    <h1>Welcome to Kriegspiel!</h1>

                    <p> Kriegspiel is a variation of chess where you cannot see your opponents pieces. On a players turn they will suggest a
                        move and the game engine will determine if the move is valid based on the locations of the opponent's pieces.  If the move
                        is legal then the player's piece will be moved to the new location.  Otherwise the player will get to try a different move.
                        In this client the unit with a green background is the unit that was moved last turn, the unit with a blue background is the currently
                        selected unit, an orange sqaure indicates that the current player is in check in the direction of the orange square relative to the king,
                        and if there is a red square then a unit was captured by the opponent on that square on the previous move.  There is additional information
                        posted above the game board about the current state of the game.  For more information
                        on the game of kriegspiel visit these sites <a href="https://en.wikipedia.org/wiki/Kriegspiel_(chess)"> Wikipedia </a> <a href="http://www.chessvariants.com/incinf.dir/kriegspiel.html"> chessvariants.com </a>
                    </p>
                </Well>
            );
        }
        if (this.props.router.current[0] == 'game') {
            nav = 2;
            content = (
                <Well>
                    <MatchMaking />
                </Well>
            )
        }
        if (this.props.router.current[0] == 'ai') {
            nav = 3;
            content = (
                <Well>
                    <AI />
                </Well>
            )
        }

        if (this.props.router.current[0] == 'settings') {
            nav = 4;
            content = (
                <Well>
                    <UserInfo />
                </Well>
            )
        }
        return (
            <div className="content">
                <MainNav current={nav} />
                <Well>
                    {content}
                </Well>
            </div>
        );
    }
});

var Router = Backbone.Router.extend({
    current: ['home'],
    routes: {
        '*actions': function(actions) {
            if (actions) {
                this.current = actions.split('/');
            } else {
                this.current = ["home"];
            }
        }
    },
});

var router = new Router();

React.renderComponent(
    <InterfaceComponent router={router} />,
    document.body
);

Backbone.history.start();
