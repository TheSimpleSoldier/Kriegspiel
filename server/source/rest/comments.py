import json
import logging

from lib.bottle import get, post, request, response

from google.appengine.api import users

import models
import GameEngine

@post('/login')
def login():
    userID = request.json.get('userID')
    userInfo = models.User.query().filter(models.User.userID == userID).fetch(1)
    return models.login_to_json(userInfo[0])

@post('/updateUser')
def updateUser():
    userID = request.json.get('userID')
    userInfo = models.User.query().filter(models.User.userID == userID).fetch(1)
    userInfo[0]['alias'] = request.json.get('alias')
    userInfo[0]['spriteURL'] = request.json.get('spriteURL')
    userInfo[0]['games'] = request.json.get('games')
    userInfo[0]['kingURL'] = request.json.get('kingURL')
    userInfo[0]['queenURL'] = request.json.get('queenURL')
    userInfo[0]['rookURL'] = request.json.get('rookURL')
    userInfo[0]['bishopURL'] = request.json.get('bishopURL')
    userInfo[0]['knightURL'] = request.json.get('knightURL')
    userInfo[0]['pawnURL'] = request.json.get('pawnURL')
    userInfo[0].put()

@get('/comments/')
def get_all_comments():
    logging.info("Getting all comments!")
    comments = models.Comment.query().order(models.Comment.created).fetch(100)
    to_return = [models.comment_to_json(comment) for comment in comments]
    response.content_type = 'application/json'
    return json.dumps(to_return)


@post('/opponentJoined')
def opponent_joined():

    game_id = request.json.get('gameId')

    oldBoard = models.Gameboard.query().filter(models.Gameboard.gameID == game_id).fetch(1)

    response.content_type = 'application/json'

    if len(oldBoard) > 0 and oldBoard[0].hasStarted:
        return models.opponent_joined_to_json('1')
    else:
        return models.opponent_joined_to_json('0')


@post('/opponentMoved')
def opponent_moved():

    game_id = request.json.get('gameId')

    oldBoard = models.Gameboard.query().filter(models.Gameboard.gameID == game_id).fetch(1)

    response.content_type = 'application/json'

    if GameEngine.inCheckMate(oldBoard[0].board, True):
        oldBoard[0].loser = 1
        oldBoard[0].put()
    elif GameEngine.inCheckMate(oldBoard[0].board, False):
        oldBoard[0].loser = 2
        oldBoard[0].put()

    pawnLocs = GameEngine.pawnAttacks(oldBoard[0].board, oldBoard[0].isWhite)
    checkLocs = []

    if len(oldBoard) > 0 and oldBoard[0].isWhite:
        return models.opponent_moved_to_json('0', oldBoard[0].board, oldBoard[0].loser, pawnLocs, checkLocs)
    else:
        return models.opponent_moved_to_json('1', oldBoard[0].board, oldBoard[0].loser, pawnLocs, checkLocs)


@post('/surrender')
def surrender():
    game_id = request.json.get('gameId')
    team = request.json.get('ourTeam')

    oldBoard = models.Gameboard.query().filter(models.Gameboard.gameID == game_id).fetch(1)
    if team:
        oldBoard[0].loser = 1
    else:
        oldBoard[0].loser = 2

    oldBoard[0].put()
    response.content_type = 'application/json'
    return {
        '': ''
    }

@post('/move')
def post_move():
    start = request.json.get('start')
    end = request.json.get('end')
    is_white = request.json.get('isWhite')
    game_id = request.json.get('gameId')

    user = users.get_current_user()
    logging.info(user.user_id())

    oldBoard = models.Gameboard.query().filter(models.Gameboard.gameID == game_id).fetch(1)

    if len(oldBoard) == 0:
        logging.info("board is of length 0")

    positions = oldBoard[0].board

    move = GameEngine.isValidMove(positions, is_white, start, end)

    logging.info("move made")
    logging.info(start)
    logging.info(end)
    logging.info(game_id)

    if move >= 3:
        oldBoard[0].lastMove = end
        oldBoard[0].isWhite = not is_white
        if move >= 4:
            positions[move - 4] = 0

        for loc in range(0, 32):
            if positions[loc] == start:
                positions[loc] = end
                break

        oldBoard[0].board = positions

        oldBoard[0].put()

    if GameEngine.inCheckMate(oldBoard[0].board, True):
        oldBoard[0].loser = 1
        oldBoard[0].put()
    elif GameEngine.inCheckMate(oldBoard[0].board, False):
        oldBoard[0].loser = 2
        oldBoard[0].put()

    response.content_type = 'application/json'
    return models.move_response_to_json(move, oldBoard[0].board, oldBoard[0].loser)


@post('/newgame')
def new_game():
    oldBoard = models.Gameboard.query().order(-models.Gameboard.gameID).fetch(1)

    if len(oldBoard) > 0 and not oldBoard[0].hasStarted:
        oldBoard[0].hasStarted = True
        oldBoard[0].put()
        response.content_type = 'application/json'
        return models.new_game_to_json('black', oldBoard[0].gameID)
    else:
        id = 0

        if len(oldBoard) == 1:
            id = oldBoard[0].gameID+1

        board = models.Gameboard(isWhite=True,
                                 board=GameEngine.getInitialState(),
                                 gameID=id,
                                 hasStarted=False,
                                 lastMove=0
        )

        board.put()
        response.content_type = 'application/json'
        return models.new_game_to_json('white', board.gameID)


@post('/boardUpdate')
def update_board():
    game_id = request.json.get('gameId')

    oldBoard = models.Gameboard.query().filter(models.Gameboard.gameID == game_id).fetch(1)

    response.content_type = 'application/json'
    return models.board_to_json(oldBoard[0].board, oldBoard[0].loser)


@post('/comment')
def create_new_comment():
    logging.info("creating new comment")
    logging.info(request.json)
    comment = models.Comment(
        text=request.json.get('text'),
        author=request.json.get('author')
    )
    comment.put()
    response.content_type = 'application/json'
    return models.comment_to_json(comment)
