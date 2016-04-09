var React = require('react');
var marked = require('marked');

var urls = require('./urls');

var UserInfo = React.createClass({
    propTypes: {
    },
    render: function() {
        return (
            <div>
                <h2>
                    User Profile
                </h2>
            </div>
        );
    }
});

module.exports = UserInfo;