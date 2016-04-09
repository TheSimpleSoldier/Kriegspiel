var React = require('react');
var marked = require('marked');

var urls = require('./urls');

var GamePage = require('./GamePage');

var MatchMaking = React.createClass({
    propTypes: {
    },
    render: function() {
        return (
            <div>
                <h2>
                    Compete against players online!
                </h2>

                <GamePage />
            </div>
        );
    }
});

module.exports = MatchMaking;