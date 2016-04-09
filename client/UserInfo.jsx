var React = require('react');
var marked = require('marked');

var urls = require('./urls');

var Input = require('react-bootstrap').Input;

var UserInfo = React.createClass({
    propTypes: {
    },
    onNickNameChange: function(event) {
        console.log(event);
        console.log(this.refs.nickname.getValue());
    },
    render: function() {
        return (
            <div>
                <h2>
                    User Profile
                </h2>

                <Input ref="nickname" type="text" placeholder="Add Nickname" onChange={this.onNickNameChange} />
            </div>
        );
    }
});

module.exports = UserInfo;