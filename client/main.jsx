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
var Home = require('./Home');


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
                    <Home />
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
