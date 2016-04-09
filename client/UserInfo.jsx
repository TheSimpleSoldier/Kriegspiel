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
    componentDidMount: function() {
        var data = {
            '': ''
        };
        $.ajax({
            url: urls.POST.createUser,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            data: JSON.stringify(data),
            success: function(data) {
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(urls.GET.opponentJoined, status, err.toString());
            }.bind(this)
        });
    },
    updateProfile: function() {
            var data = {
                'alias': this.refs.nickname.getValue()
            };
        $.ajax({
            url: urls.POST.createUser,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            data: JSON.stringify(data),
            success: function(data) {
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(urls.GET.opponentJoined, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div>
                <h2>
                    User Profile
                </h2>

                <Input ref="nickname" type="text" placeholder="Add Nickname" onChange={this.onNickNameChange} />
                <Button bsStyle="success" onClick={this.updateProfile}> Update Profile </Button>
            </div>
        );
    }
});

module.exports = UserInfo;