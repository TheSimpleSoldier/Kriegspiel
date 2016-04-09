import json
import logging

from lib.bottle import get, post, request, response

from google.appengine.api import users

import models
import GameEngine


@get('/comments/')
def get_all_comments():
    logging.info("Getting all comments!")
    comments = models.Comment.query().order(models.Comment.created).fetch(100)
    to_return = [models.comment_to_json(comment) for comment in comments]
    response.content_type = 'application/json'
    return json.dumps(to_return)


@get('/opponentJoined/')
def opponent_joined():

    response.content_type = 'application/json'
    return models.opponent_joined_to_json('1')


@get('/opponentMoved/')
def opponent_joined():

    response.content_type = 'application/json'
    return models.opponent_moved_to_json('1')


@post('/move')
def post_move():
    start = request.json.get('start')
    end = request.json.get('end')
    is_white = request.json.get('isWhite')

    user = users.get_current_user()
    logging.info(user.user_id())
    oldBoard = models.Gameboard.query().order(models.Gameboard.timestamp).fetch(1)
    positions = oldBoard.board

    move = GameEngine.isValidMove(positions, is_white, start, end)

    if move >= 3:
        if move >= 4:
            positions[move - 4] = 0
        for loc in range(0, 32):
            if positions[loc] == start:
                positions[loc] = end
                break

        gameboard = models.Gameboard(
            isWhite = not is_white,
            board = positions
        )
        gameboard.put()

    response.content_type = 'application/json'
    return models.move_response_to_json(move)


@post('/newgame')
def new_game():
    oldBoard = models.Gameboard.query().order(-models.Gameboard.gameID).fetch(1)
    id = 0

    if len(oldBoard) == 1:
        id = oldBoard[0].gameID+1

    board = models.Gameboard(isWhite=True,
                             board=GameEngine.getInitialState(),
                             gameID=id
    )

    board.put()
    response.content_type = 'application/json'
    return models.new_game_to_json('white', board.gameID)

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
