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
            lastMove: 0,
            isWhite: true,
            gameStarted: false,
            waiting: false,
            gameId: 0,
            ourTeam: true,
            moves: 0,
            unitKilled: "",
            killedLoc: 0,
            checkmate: 0,
            pieces: [
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
            ],
            board: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        };
    },

    shouldUpdateBoard: function(board) {
        for (var i = 0; i < board.length; i++) {
            if (board[i] != this.state.board[i]) {
                return true;
            }
        }
        return false;
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
                    this.setState({'moveToX': x, 'moveToY': y});
                    var newData = data['move'];

                    if (newData >= 3) {
                        this.setState({moves: this.state.moves+1});
                        this.setState({lastMove: (x + 8 * y + 1)});
                        this.updateGameState(data['board']);
                        this.setState({selected: 0});
                        this.setState({isWhite: !this.state.isWhite});
                        this.setState({killedLoc: 0});
                        this.setState({checkmate: data['checkmate']});
                    }

                    this.setState({'unitKilled': ""});

                    if (newData > 3) {
                        this.setState({});
                        this.setState({'unitKilled': this.unitKilled(newData - 4)});
                    }

                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(urls.POST.newComment, status, err.toString());
                }.bind(this)
            });
    },

    handlePieceClicked: function(x, y) {
        if (!this.state.gameStarted) {
            console.log("game has not started");
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

    unitKilled: function(move) {
        if (move > 15) {
            move -= 16;
        }

        // king
        if (move == 0) {
            return "King";
        } else if (move == 1) { // queen
            return "Queen";
        } else if (move < 4) { // rook
            return "Rook";
        } else if (move < 6) { // knight
            return "Knight";
        } else if (move < 8) { // bishop
            return "Bishop";
        } else { // pawn
            return "Pawn";
        }
    },

    clearBoard: function() {
        var positions = this.state.pieces;

        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                positions[i][j] = "";
            }
        }

        this.setState({ 'pieces': positions });
    },

    isPosInBoard: function(board, pos) {
        for (var i = 0; i < 32; i++) {
            if (board[i] == pos) {
                return true;
            }
        }
        return false;
    },

    /*
    [wK, wQ, wR1, wR2, wKn1, wKn2, wB1, wB2, wP1, wP2, wP3, wP4, wP5, wP6, wP7, wP8,
    bK, bQ, bR1, bR2, bKn1, bKn2, bB1, bB2, bP1, bP2, bP3, bP4, bP5, bP6, bP7, bP8]
     */
    updateGameState: function(board) {
        if (board == undefined || board.length < 32 || this.state.moves == 0 || !this.shouldUpdateBoard(board)) {
            return;
        }

        for (var i = 0; i < this.state.board.length; i++) {
            // if a piece was killed
            if (this.state.board[i] > 0 && board[i] == 0) {
                this.setState({killedLoc: this.state.board[i]});
            }
        }

        this.setState({'board': board});

        var places = ["whiteKing.png", "whiteQueen.png", "whiteRook.png", "whiteRook.png", "whiteKnight.png", "whiteKnight.png", "whiteBishop.png", "whiteBishop.png", "whitePawn.png", "whitePawn.png", "whitePawn.png", "whitePawn.png", "whitePawn.png", "whitePawn.png", "whitePawn.png", "whitePawn.png",
                      "blackKing.png", "blackQueen.png", "blackRook.png", "blackRook.png", "blackKnight.png", "blackKnight.png", "blackBishop.png",  "blackBishop.png", "blackPawn.png", "blackPawn.png", "blackPawn.png", "blackPawn.png", "blackPawn.png", "blackPawn.png", "blackPawn.png", "blackPawn.png"];
        var x, y;
        var positions = this.state.pieces;

        this.clearBoard();

        if (this.state.ourTeam) {
            for (var i = 0; i < 16; i++) {
                if (board[i] > 0) {
                    x = (board[i] - 1) % 8;
                    y = Math.floor((board[i] - 1) / 8);
                    positions[y][x] = places[i];
                }
            }
        } else {
            for (var i = 16; i < 32; i++) {
                if (board[i] > 0) {
                    x = (board[i] - 1) % 8;
                    y = Math.floor((board[i] - 1) / 8);
                    positions[y][x] = places[i];
                }
            }
        }
    },

    gameStarted: function() {
      this.setState({'gameStarted': true, 'waiting': false});
    },

    opponentMoved: function(board, checkmate) {
        this.updateGameState(board);

        this.setState({checkmate: checkmate});
        this.setState({'isWhite': !this.state.isWhite});
    },

    handleSurrender: function() {
        var data = { 'ourTeam':this.state.ourTeam, 'gameId': this.state.gameId };
        $.ajax({
            url: urls.POST.surrender,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            data: JSON.stringify(data),
            success: function(data) {
                this.setState({
                    moveToX: 0,
                    moveToY: 0,
                    selected: 0,
                    lastMove: 0,
                    isWhite: true,
                    gameStarted: false,
                    waiting: false,
                    gameId: 0,
                    ourTeam: true,
                    moves: 0,
                    unitKilled: "",
                    killedLoc: 0,
                    checkmate: 0,
                    pieces: [
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", "", ""],
                    ],
                    board: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(urls.POST.newComment, status, err.toString());
            }.bind(this)
        });
    },

    render: function() {
        console.log('waiting: ' + this.state.waiting);

        var divStyle = {
            'height': '1000px'
        };

        var waiting = (<div></div>);
        var opponentMoved = (<div></div>);
        var msg = (<div></div>);
        var killedOpponent = (<div></div>);
        var updateBoard = (<div></div>);

        if (this.state.unitKilled != "") {
            killedOpponent = (<div>
                You captured a {this.state.unitKilled}
            </div>)
        }

        if (this.state.gameStarted && this.state.isWhite != this.state.ourTeam) {
            opponentMoved = (
                <OpponentMoved pollInterval={1000} callBack={this.opponentMoved} gameId={this.state.gameId} ourTeam={this.state.ourTeam} />
            )
        }

        if (this.state.gameStarted) {
            updateBoard = (<boardUpdated pollInterval={250} callBack={this.updateGameState} gameId={this.state.gameId} />)
        }

        if (this.state.gameStarted && this.state.isWhite != this.state.ourTeam) {
            msg = (<h3>
                Waiting for opponent to move...
            </h3>);
        } else if (this.state.gameStarted) {
            msg = (<h3>
               It is your turn
            </h3>);
        }

        if (this.state.checkmate > 0) {
            if (this.state.checkmate == 1) {
                if (this.state.ourTeam) {
                    msg = (<h3>
                        Defeat! You have been utterly defeated.
                    </h3>);
                } else {
                    msg = (<h3>
                        Victory! The enemy is at your mercy.
                    </h3>);
                }
            } else {
                if (this.state.ourTeam) {
                    msg = (<h3>
                        Victory! The enemy is at your mercy.
                    </h3>);
                } else {
                    msg = (<h3>
                        Defeat! You have been utterly defeated.
                    </h3>);
                }
            }
        }

        var button = (<Button onClick={this.handleNewGame}>
                    New Game
                </Button>);

        if (this.state.gameStarted) {
            button = (<Button bsStyle="danger" onClick={this.handleSurrender}>
                    Surrender
                </Button>);
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
                {updateBoard}
                <h2>
                    Kriegspiel
                </h2>

                {button}

                {msg}
                {killedOpponent}

                <br /> <br /> <br />

                <Piece piece={this.state.pieces[0][0]} xLoc={0} yLoc={0} selected={this.state.selected == 1} lastMove={this.state.lastMove == 1} killedLoc={this.state.killedLoc == 1} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[0][1]} xLoc={1} yLoc={0} selected={this.state.selected == 2} lastMove={this.state.lastMove == 2} killedLoc={this.state.killedLoc == 2} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[0][2]} xLoc={2} yLoc={0} selected={this.state.selected == 3} lastMove={this.state.lastMove == 3} killedLoc={this.state.killedLoc == 3} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[0][3]} xLoc={3} yLoc={0} selected={this.state.selected == 4} lastMove={this.state.lastMove == 4} killedLoc={this.state.killedLoc == 4} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[0][4]} xLoc={4} yLoc={0} selected={this.state.selected == 5} lastMove={this.state.lastMove == 5} killedLoc={this.state.killedLoc == 5} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[0][5]} xLoc={5} yLoc={0} selected={this.state.selected == 6} lastMove={this.state.lastMove == 6} killedLoc={this.state.killedLoc == 6} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[0][6]} xLoc={6} yLoc={0} selected={this.state.selected == 7} lastMove={this.state.lastMove == 7} killedLoc={this.state.killedLoc == 7} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[0][7]} xLoc={7} yLoc={0} selected={this.state.selected == 8} lastMove={this.state.lastMove == 8} killedLoc={this.state.killedLoc == 8} onClick={this.handlePieceClicked} />

                <br /> <br /> <br /> <br /> <br /> <br />

                <Piece piece={this.state.pieces[1][0]} xLoc={0} yLoc={1} selected={this.state.selected == 9} lastMove={this.state.lastMove == 9} killedLoc={this.state.killedLoc == 9} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[1][1]} xLoc={1} yLoc={1} selected={this.state.selected == 10} lastMove={this.state.lastMove == 10} killedLoc={this.state.killedLoc == 10} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[1][2]} xLoc={2} yLoc={1} selected={this.state.selected == 11} lastMove={this.state.lastMove == 11} killedLoc={this.state.killedLoc == 11} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[1][3]} xLoc={3} yLoc={1} selected={this.state.selected == 12} lastMove={this.state.lastMove == 12} killedLoc={this.state.killedLoc == 12} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[1][4]} xLoc={4} yLoc={1} selected={this.state.selected == 13} lastMove={this.state.lastMove == 13} killedLoc={this.state.killedLoc == 13} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[1][5]} xLoc={5} yLoc={1} selected={this.state.selected == 14} lastMove={this.state.lastMove == 14} killedLoc={this.state.killedLoc == 14} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[1][6]} xLoc={6} yLoc={1} selected={this.state.selected == 15} lastMove={this.state.lastMove == 15} killedLoc={this.state.killedLoc == 15} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[1][7]} xLoc={7} yLoc={1} selected={this.state.selected == 16} lastMove={this.state.lastMove == 16} killedLoc={this.state.killedLoc == 16} onClick={this.handlePieceClicked} />

                <br /> <br /> <br /> <br /> <br /> <br />

                <Piece piece={this.state.pieces[2][0]} xLoc={0} yLoc={2} selected={this.state.selected == 17} lastMove={this.state.lastMove == 17} killedLoc={this.state.killedLoc == 17} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[2][1]} xLoc={1} yLoc={2} selected={this.state.selected == 18} lastMove={this.state.lastMove == 18} killedLoc={this.state.killedLoc == 18} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[2][2]} xLoc={2} yLoc={2} selected={this.state.selected == 19} lastMove={this.state.lastMove == 19} killedLoc={this.state.killedLoc == 19} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[2][3]} xLoc={3} yLoc={2} selected={this.state.selected == 20} lastMove={this.state.lastMove == 20} killedLoc={this.state.killedLoc == 20} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[2][4]} xLoc={4} yLoc={2} selected={this.state.selected == 21} lastMove={this.state.lastMove == 21} killedLoc={this.state.killedLoc == 21} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[2][5]} xLoc={5} yLoc={2} selected={this.state.selected == 22} lastMove={this.state.lastMove == 22} killedLoc={this.state.killedLoc == 22} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[2][6]} xLoc={6} yLoc={2} selected={this.state.selected == 23} lastMove={this.state.lastMove == 23} killedLoc={this.state.killedLoc == 23} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[2][7]} xLoc={7} yLoc={2} selected={this.state.selected == 24} lastMove={this.state.lastMove == 24} killedLoc={this.state.killedLoc == 24} onClick={this.handlePieceClicked} />

                <br /> <br /> <br /> <br /> <br /> <br />

                <Piece piece={this.state.pieces[3][0]} xLoc={0} yLoc={3} selected={this.state.selected == 25} lastMove={this.state.lastMove == 25} killedLoc={this.state.killedLoc == 25} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[3][1]} xLoc={1} yLoc={3} selected={this.state.selected == 26} lastMove={this.state.lastMove == 26} killedLoc={this.state.killedLoc == 26} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[3][2]} xLoc={2} yLoc={3} selected={this.state.selected == 27} lastMove={this.state.lastMove == 27} killedLoc={this.state.killedLoc == 27} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[3][3]} xLoc={3} yLoc={3} selected={this.state.selected == 28} lastMove={this.state.lastMove == 28} killedLoc={this.state.killedLoc == 28} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[3][4]} xLoc={4} yLoc={3} selected={this.state.selected == 29} lastMove={this.state.lastMove == 29} killedLoc={this.state.killedLoc == 29} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[3][5]} xLoc={5} yLoc={3} selected={this.state.selected == 30} lastMove={this.state.lastMove == 30} killedLoc={this.state.killedLoc == 30} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[3][6]} xLoc={6} yLoc={3} selected={this.state.selected == 31} lastMove={this.state.lastMove == 31} killedLoc={this.state.killedLoc == 31} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[3][7]} xLoc={7} yLoc={3} selected={this.state.selected == 32} lastMove={this.state.lastMove == 32} killedLoc={this.state.killedLoc == 32} onClick={this.handlePieceClicked} />

                <br /> <br /> <br /> <br /> <br /> <br />

                <Piece piece={this.state.pieces[4][0]} xLoc={0} yLoc={4} selected={this.state.selected == 33} lastMove={this.state.lastMove == 33} killedLoc={this.state.killedLoc == 33} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[4][1]} xLoc={1} yLoc={4} selected={this.state.selected == 34} lastMove={this.state.lastMove == 34} killedLoc={this.state.killedLoc == 34} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[4][2]} xLoc={2} yLoc={4} selected={this.state.selected == 35} lastMove={this.state.lastMove == 35} killedLoc={this.state.killedLoc == 335} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[4][3]} xLoc={3} yLoc={4} selected={this.state.selected == 36} lastMove={this.state.lastMove == 36} killedLoc={this.state.killedLoc == 36} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[4][4]} xLoc={4} yLoc={4} selected={this.state.selected == 37} lastMove={this.state.lastMove == 37} killedLoc={this.state.killedLoc == 37} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[4][5]} xLoc={5} yLoc={4} selected={this.state.selected == 38} lastMove={this.state.lastMove == 38} killedLoc={this.state.killedLoc == 38} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[4][6]} xLoc={6} yLoc={4} selected={this.state.selected == 39} lastMove={this.state.lastMove == 39} killedLoc={this.state.killedLoc == 39} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[4][7]} xLoc={7} yLoc={4} selected={this.state.selected == 40} lastMove={this.state.lastMove == 40} killedLoc={this.state.killedLoc == 40} onClick={this.handlePieceClicked} />

                <br /> <br /> <br /> <br /> <br /> <br />

                <Piece piece={this.state.pieces[5][0]} xLoc={0} yLoc={5} selected={this.state.selected == 41} lastMove={this.state.lastMove == 41} killedLoc={this.state.killedLoc == 41} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[5][1]} xLoc={1} yLoc={5} selected={this.state.selected == 42} lastMove={this.state.lastMove == 42} killedLoc={this.state.killedLoc == 42} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[5][2]} xLoc={2} yLoc={5} selected={this.state.selected == 43} lastMove={this.state.lastMove == 43} killedLoc={this.state.killedLoc == 43} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[5][3]} xLoc={3} yLoc={5} selected={this.state.selected == 44} lastMove={this.state.lastMove == 44} killedLoc={this.state.killedLoc == 44} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[5][4]} xLoc={4} yLoc={5} selected={this.state.selected == 45} lastMove={this.state.lastMove == 45} killedLoc={this.state.killedLoc == 45} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[5][5]} xLoc={5} yLoc={5} selected={this.state.selected == 46} lastMove={this.state.lastMove == 46} killedLoc={this.state.killedLoc == 46} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[5][6]} xLoc={6} yLoc={5} selected={this.state.selected == 47} lastMove={this.state.lastMove == 47} killedLoc={this.state.killedLoc == 47} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[5][7]} xLoc={7} yLoc={5} selected={this.state.selected == 48} lastMove={this.state.lastMove == 48} killedLoc={this.state.killedLoc == 48} onClick={this.handlePieceClicked} />

                <br /> <br /> <br /> <br /> <br /> <br />

                <Piece piece={this.state.pieces[6][0]} xLoc={0} yLoc={6} selected={this.state.selected == 49} lastMove={this.state.lastMove == 49} killedLoc={this.state.killedLoc == 49} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[6][1]} xLoc={1} yLoc={6} selected={this.state.selected == 50} lastMove={this.state.lastMove == 50} killedLoc={this.state.killedLoc == 50} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[6][2]} xLoc={2} yLoc={6} selected={this.state.selected == 51} lastMove={this.state.lastMove == 51} killedLoc={this.state.killedLoc == 51} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[6][3]} xLoc={3} yLoc={6} selected={this.state.selected == 52} lastMove={this.state.lastMove == 52} killedLoc={this.state.killedLoc == 52} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[6][4]} xLoc={4} yLoc={6} selected={this.state.selected == 53} lastMove={this.state.lastMove == 53} killedLoc={this.state.killedLoc == 53} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[6][5]} xLoc={5} yLoc={6} selected={this.state.selected == 54} lastMove={this.state.lastMove == 54} killedLoc={this.state.killedLoc == 54} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[6][6]} xLoc={6} yLoc={6} selected={this.state.selected == 55} lastMove={this.state.lastMove == 55} killedLoc={this.state.killedLoc == 55} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[6][7]} xLoc={7} yLoc={6} selected={this.state.selected == 56} lastMove={this.state.lastMove == 56} killedLoc={this.state.killedLoc == 56} onClick={this.handlePieceClicked} />

                <br /> <br /> <br /> <br /> <br /> <br />

                <Piece piece={this.state.pieces[7][0]} xLoc={0} yLoc={7} selected={this.state.selected == 57} lastMove={this.state.lastMove == 57} killedLoc={this.state.killedLoc == 57} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[7][1]} xLoc={1} yLoc={7} selected={this.state.selected == 58} lastMove={this.state.lastMove == 58} killedLoc={this.state.killedLoc == 58} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[7][2]} xLoc={2} yLoc={7} selected={this.state.selected == 59} lastMove={this.state.lastMove == 59} killedLoc={this.state.killedLoc == 59} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[7][3]} xLoc={3} yLoc={7} selected={this.state.selected == 60} lastMove={this.state.lastMove == 60} killedLoc={this.state.killedLoc == 60} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[7][4]} xLoc={4} yLoc={7} selected={this.state.selected == 61} lastMove={this.state.lastMove == 61} killedLoc={this.state.killedLoc == 61} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[7][5]} xLoc={5} yLoc={7} selected={this.state.selected == 62} lastMove={this.state.lastMove == 62} killedLoc={this.state.killedLoc == 62} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[7][6]} xLoc={6} yLoc={7} selected={this.state.selected == 63} lastMove={this.state.lastMove == 63} killedLoc={this.state.killedLoc == 63} onClick={this.handlePieceClicked} />
                <Piece piece={this.state.pieces[7][7]} xLoc={7} yLoc={7} selected={this.state.selected == 64} lastMove={this.state.lastMove == 64} killedLoc={this.state.killedLoc == 64} onClick={this.handlePieceClicked} />


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

var boardUpdated = React.createClass({
    mixins: [SetIntervalMixin],
    propTypes: {
        callBack: React.PropTypes.func.isRequired,
        gameId: React.PropTypes.number.isRequired,
    },
    loadFromServer: function() {
        console.log('polling board updated');
        var data = {
            'gameId': this.props.gameId
        };
        $.ajax({
            url: urls.POST.boardUpdate,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            data: JSON.stringify(data),
            success: function(data) {
                if (data != undefined && data.length == 32) {
                    this.props.callBack(data['board']);
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(urls.GET.opponentMoved, status, err.toString());
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
                if (this.props.ourTeam && data['moved'] == 0 || !this.props.ourTeam && data['moved'] == 1 || data['checkmate'] > 0) {
                    this.props.callBack(data['board'], data['checkmate']);
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
        selected: React.PropTypes.bool.isRequired,
        lastMove: React.PropTypes.bool.isRequired,
        killedLoc: React.PropTypes.bool.isRequired,

    },
    onClick: function() {
        this.props.onClick(this.props.xLoc, this.props.yLoc);
    },

    render: function() {

        var imageStyle = {
            'width': '80',
            'height': '80px'
        };

        var xval = (this.props.xLoc * 100 + 100);
        var yval = (this.props.yLoc * 100 + 300);

        var divStyle = {
            'left': xval + "px",
            'top': yval + "px",
            'position': 'absolute'
        };

        var buttonStyle = {
            'backgroundColor': '#cccccc',
            'width': '100px',
            'height': '100px'
        };

        if (this.props.selected) {
            buttonStyle['backgroundColor'] = '#BFEFFF';
        } else if (this.props.killedLoc) {
            buttonStyle['backgroundColor'] = '#DC143C'
        }  else if (this.props.lastMove) {
            buttonStyle['backgroundColor'] = '#BCED91';
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