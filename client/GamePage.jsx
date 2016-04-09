var React = require('react');
var marked = require('marked');

var urls = require('./urls');

var Button = require('react-bootstrap').Button;

var GamePage = React.createClass({
    propTypes: {
    },
    getInitialState: function() {
        return {
            moveToX: 0,
            moveToY: 0,
            selected: 0,
            isWhite: true,
            gameStarted: false,
            waiting: false,
            gameId: 0,
            ourTeam: true,
            pieces: [
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
            ]
        };
    },

    checkIfMoveValid: function(x, y) {
        var data = {
            'start': this.state.selected,
            'end' : (x + 8 * y + 1),
            'isWhite': this.state.isWhite,
            'gameId': this.state.gameId
        };

        $.ajax({
                url: urls.POST.move,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                type: 'POST',
                data: JSON.stringify(data),
                success: function(data) {
                    console.log(data);
                    this.setState({'moveToX': x, 'moveToY': y});
                    var data = data['move'];

                    if (data >= 3) {
                        this.movePiece(x, y);
                    }

                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(urls.POST.newComment, status, err.toString());
                }.bind(this)
            });
    },

    movePiece: function(x, y) {
        var positions = this.state.pieces;

        var oldX = ((this.state.selected - 1) % 8);
        var oldY = Math.floor((this.state.selected - 1) / 8);

        console.log('oldX: ' + oldX + ' oldY: ' + oldY + "y: " + y + " x: " + x);
        console.log(positions[oldY][oldX]);
        console.log(positions[y][x]);
        positions[y][x] = positions[oldY][oldX];
        positions[oldY][oldX] = "";
        this.setState({pieces: positions});
        this.setState({selected: 0});
        this.setState({isWhite: !this.state.isWhite});
        this.setState({});
    },

    handlePieceClicked: function(x, y) {

        if (!this.state.gameStarted) {
            console.log("game has not startd");
            return;
        } else if (this.state.isWhite != this.state.ourTeam) {
            console.log("you cann't move for the other team!");
            return;
        }

        console.log("x: " + x + ", y: " + y);

        var spot = x+y*8+1;

        // if a spot hasn't been picked
        if (spot == this.state.selected) {
            this.setState({selected: 0});
        } else if (this.state.selected == 0) {
            console.log("selecting a piece: " + spot);
            var loc = this.state.pieces[y][x];

            if (this.state.isWhite) {
                if (loc.includes("white")) {
                    this.setState({selected: spot});
                }
            } else {
                if (loc.includes("black")) {
                    this.setState({selected: spot});
                }
            }

        } else { // moving!
            var loc = this.state.pieces[y][x];
            if (this.state.isWhite && loc.includes('white')) {
                this.setState({selected: spot});
                return;
            } else if (!this.state.isWhite && loc.includes('black')) {
                this.setState({selected: spot});
                return;
            }

            this.checkIfMoveValid(x,y);
        }
    },

    handleNewGame: function() {
        $.ajax({
            url: urls.POST.newgame,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            success: function(data) {
                console.log(data);

                if (data['team'] == 'white') {
                    console.log('we are white');
                    this.setState({'waiting': true, 'gameStarted': false, 'ourTeam': true});

                    this.setState({'pieces': [
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["whitePawn.png", "whitePawn.png", "whitePawn.png", "whitePawn.png", "whitePawn.png", "whitePawn.png", "whitePawn.png", "whitePawn.png"],
                        ["whiteRook.png", "whiteKnight.png", "whiteBishop.png", "whiteQueen.png", "whiteKing.png", "whiteBishop.png", "whiteKnight.png", "whiteRook.png"]
                    ]})
                } else {
                    console.log('we are black');
                    this.setState({'waiting': false, 'gameStarted': true, 'ourTeam': false});

                    this.setState({'pieces': [
                        ["blackRook.png", "blackKnight.png", "blackBishop.png", "blackQueen.png", "blackKing.png", "blackBishop.png", "blackKnight.png", "blackRook.png"],
                        ["blackPawn.png", "blackPawn.png", "blackPawn.png", "blackPawn.png", "blackPawn.png", "blackPawn.png", "blackPawn.png", "blackPawn.png"],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                    ]});
                }

                this.setState({'gameId': data['id'], 'isWhite': true});

            }.bind(this),
            error: function(xhr, status, err) {
                console.error(urls.POST.newComment, status, err.toString());
            }.bind(this)
        });
    },

    gameStarted: function() {
      this.setState({'gameStarted': true, 'waiting': false});
    },

    opponentMoved: function() {
        this.setState({'isWhite': !this.state.isWhite});
    },

    render: function() {

        console.log('waiting: ' + this.state.waiting);

        var divStyle = {
            'height': '1000px'
        };

        var waiting = (<div></div>);
        var opponentMoved = (<div></div>);

        if (this.state.gameStarted && this.state.isWhite != this.state.ourTeam) {
            opponentMoved = (
                <OpponentMoved pollInterval={1000} callBack={this.opponentMoved} gameId={this.state.gameId} ourTeam={this.state.ourTeam} />
            )
        }

        console.log('gameStarted: ' + this.state.gameStarted);

        if (this.state.waiting) {
            waiting = (
                <WaitingForOpponent pollInterval={1000} callBack={this.gameStarted} gameId={this.state.gameId} />
            );
        }

        return (
            <div style={divStyle} >
                {waiting}
                {opponentMoved}
                <h2>
                    Kriegspiel
                </h2>

                <Button onClick={this.handleNewGame}>
                    New Game
                </Button>

                <br /> <br />

                <Piece piece={this.state.pieces[0][0]} xLoc={0} yLoc={0} selected={this.state.selected == 1} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[0][1]} xLoc={1} yLoc={0} selected={this.state.selected == 2} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[0][2]} xLoc={2} yLoc={0} selected={this.state.selected == 3} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[0][3]} xLoc={3} yLoc={0} selected={this.state.selected == 4} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[0][4]} xLoc={4} yLoc={0} selected={this.state.selected == 5} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[0][5]} xLoc={5} yLoc={0} selected={this.state.selected == 6} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[0][6]} xLoc={6} yLoc={0} selected={this.state.selected == 7} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[0][7]} xLoc={7} yLoc={0} selected={this.state.selected == 8} onClick={this.handlePieceClicked} />

                <br /> <br /> <br /> <br /> <br /> <br />

                <Piece piece={this.state.pieces[1][0]} xLoc={0} yLoc={1} selected={this.state.selected == 9} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[1][1]} xLoc={1} yLoc={1} selected={this.state.selected == 10} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[1][2]} xLoc={2} yLoc={1} selected={this.state.selected == 11} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[1][3]} xLoc={3} yLoc={1} selected={this.state.selected == 12} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[1][4]} xLoc={4} yLoc={1} selected={this.state.selected == 13} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[1][5]} xLoc={5} yLoc={1} selected={this.state.selected == 14} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[1][6]} xLoc={6} yLoc={1} selected={this.state.selected == 15} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[1][7]} xLoc={7} yLoc={1} selected={this.state.selected == 16} onClick={this.handlePieceClicked} />

                <br /> <br /> <br /> <br /> <br /> <br />

                <Piece piece={this.state.pieces[2][0]} xLoc={0} yLoc={2} selected={this.state.selected == 17} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[2][1]} xLoc={1} yLoc={2} selected={this.state.selected == 18} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[2][2]} xLoc={2} yLoc={2} selected={this.state.selected == 19} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[2][3]} xLoc={3} yLoc={2} selected={this.state.selected == 20} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[2][4]} xLoc={4} yLoc={2} selected={this.state.selected == 21} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[2][5]} xLoc={5} yLoc={2} selected={this.state.selected == 22} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[2][6]} xLoc={6} yLoc={2} selected={this.state.selected == 23} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[2][7]} xLoc={7} yLoc={2} selected={this.state.selected == 24} onClick={this.handlePieceClicked} />

                <br /> <br /> <br /> <br /> <br /> <br />

                <Piece piece={this.state.pieces[3][0]} xLoc={0} yLoc={3} selected={this.state.selected == 25} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[3][1]} xLoc={1} yLoc={3} selected={this.state.selected == 26} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[3][2]} xLoc={2} yLoc={3} selected={this.state.selected == 27} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[3][3]} xLoc={3} yLoc={3} selected={this.state.selected == 28} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[3][4]} xLoc={4} yLoc={3} selected={this.state.selected == 29} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[3][5]} xLoc={5} yLoc={3} selected={this.state.selected == 30} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[3][6]} xLoc={6} yLoc={3} selected={this.state.selected == 31} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[3][7]} xLoc={7} yLoc={3} selected={this.state.selected == 32} onClick={this.handlePieceClicked} />

                <br /> <br /> <br /> <br /> <br /> <br />

                <Piece piece={this.state.pieces[4][0]} xLoc={0} yLoc={4} selected={this.state.selected == 33} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[4][1]} xLoc={1} yLoc={4} selected={this.state.selected == 34} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[4][2]} xLoc={2} yLoc={4} selected={this.state.selected == 35} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[4][3]} xLoc={3} yLoc={4} selected={this.state.selected == 36} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[4][4]} xLoc={4} yLoc={4} selected={this.state.selected == 37} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[4][5]} xLoc={5} yLoc={4} selected={this.state.selected == 38} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[4][6]} xLoc={6} yLoc={4} selected={this.state.selected == 39} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[4][7]} xLoc={7} yLoc={4} selected={this.state.selected == 40} onClick={this.handlePieceClicked} />

                <br /> <br /> <br /> <br /> <br /> <br />

                <Piece piece={this.state.pieces[5][0]} xLoc={0} yLoc={5} selected={this.state.selected == 41} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[5][1]} xLoc={1} yLoc={5} selected={this.state.selected == 42} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[5][2]} xLoc={2} yLoc={5} selected={this.state.selected == 43} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[5][3]} xLoc={3} yLoc={5} selected={this.state.selected == 44} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[5][4]} xLoc={4} yLoc={5} selected={this.state.selected == 45} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[5][5]} xLoc={5} yLoc={5} selected={this.state.selected == 46} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[5][6]} xLoc={6} yLoc={5} selected={this.state.selected == 47} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[5][7]} xLoc={7} yLoc={5} selected={this.state.selected == 48} onClick={this.handlePieceClicked} />

                <br /> <br /> <br /> <br /> <br /> <br />

                <Piece piece={this.state.pieces[6][0]} xLoc={0} yLoc={6} selected={this.state.selected == 49} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[6][1]} xLoc={1} yLoc={6} selected={this.state.selected == 50} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[6][2]} xLoc={2} yLoc={6} selected={this.state.selected == 51} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[6][3]} xLoc={3} yLoc={6} selected={this.state.selected == 52} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[6][4]} xLoc={4} yLoc={6} selected={this.state.selected == 53} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[6][5]} xLoc={5} yLoc={6} selected={this.state.selected == 54} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[6][6]} xLoc={6} yLoc={6} selected={this.state.selected == 55} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[6][7]} xLoc={7} yLoc={6} selected={this.state.selected == 56} onClick={this.handlePieceClicked} />

                <br /> <br /> <br /> <br /> <br /> <br />

                <Piece piece={this.state.pieces[7][0]} xLoc={0} yLoc={7} selected={this.state.selected == 57} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[7][1]} xLoc={1} yLoc={7} selected={this.state.selected == 58} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[7][2]} xLoc={2} yLoc={7} selected={this.state.selected == 59} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[7][3]} xLoc={3} yLoc={7} selected={this.state.selected == 60} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[7][4]} xLoc={4} yLoc={7} selected={this.state.selected == 61} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[7][5]} xLoc={5} yLoc={7} selected={this.state.selected == 62} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[7][6]} xLoc={6} yLoc={7} selected={this.state.selected == 63} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[7][7]} xLoc={7} yLoc={7} selected={this.state.selected == 64} onClick={this.handlePieceClicked} />


            </div>
        );
    }
});

var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.map(clearInterval);
  }
};

var OpponentMoved = React.createClass({
    mixins: [SetIntervalMixin],
    propTypes: {
        callBack: React.PropTypes.func.isRequired,
        gameId: React.PropTypes.number.isRequired,
        ourTeam: React.PropTypes.bool.isRequired,
    },
    loadFromServer: function() {
        console.log('polling opponent moved');

        var data = {
            'gameId': this.props.gameId
        };
        $.ajax({
            url: urls.POST.opponentMoved,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            data: JSON.stringify(data),
            success: function(data) {
                if (this.props.ourTeam && data['moved'] == 0 || !this.props.ourTeam && data['moved'] == 1) {
                    this.props.callBack();
                    console.log('opponent moved: ' + data['moved']);
                }


            }.bind(this),
            error: function(xhr, status, err) {
                console.error(urls.GET.opponentMoved, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        console.log("component Mounted");
        this.loadFromServer();
        this.setInterval(this.loadFromServer, this.props.pollInterval);
    },


    render: function() {
        return (
            <div>
            </div>
        )
    }
});

var WaitingForOpponent = React.createClass({
    mixins: [SetIntervalMixin],
    propTypes: {
        callBack: React.PropTypes.func.isRequired,
        gameId: React.PropTypes.string.isRequired
    },
    loadFromServer: function() {
        var data = {
            'gameId': this.props.gameId
        };
        console.log('waiting for opponent');
        $.ajax({
            url: urls.POST.opponentJoined,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            data: JSON.stringify(data),
            success: function(data) {
                console.log('opponent joined: ' + data['joined']);
                if (data['joined'] > 0) {
                    this.props.callBack();
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(urls.GET.opponentJoined, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadFromServer();
        this.setInterval(this.loadFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div>

            </div>
        )
    }
});

var Piece = React.createClass({
    propTypes: {
        piece: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired,
        xLoc: React.PropTypes.number.isRequired,
        yLoc: React.PropTypes.number.isRequired,
        selected: React.PropTypes.bool.isRequired
    },
    onClick: function() {
        console.log("onClick");

        this.props.onClick(this.props.xLoc, this.props.yLoc);
    },

    render: function() {

        var imageStyle = {
            'width': '100px',
            'height': '100px'
        };

        var divStyle = {
            'float': 'left'
        };

        var buttonStyle = {
            'backgroundColor': '#cccccc',
            'width': '120px',
            'height': '120px'
        };

        if (this.props.selected) {
            buttonStyle['backgroundColor'] = '#BFEFFF';
        } else if (this.props.xLoc % 2 == this.props.yLoc % 2) {
             buttonStyle['backgroundColor'] = '#ffffff';
        }

        if (this.props.piece == "") {
            return (
                <div style={divStyle}>
                <Button style={buttonStyle} onClick={this.onClick}>
                </Button>
            </div>
            );
        }

        return (
            <div style={divStyle}>
                <Button style={buttonStyle} onClick={this.onClick}>
                    <img src={'/static/images/chessPieces/' + this.props.piece} style={imageStyle} />
                </Button>
            </div>
        );
    }
});

module.exports = GamePage;