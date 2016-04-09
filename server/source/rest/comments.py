import json
import logging

from lib.bottle import get, post, request, response

import models
import GameEngine

@get('/comments/')
def get_all_comments():
    logging.info("Getting all comments!")
    comments = models.Comment.query().order(models.Comment.created).fetch(100)
    to_return = [models.comment_to_json(comment) for comment in comments]
    response.content_type = 'application/json'
    return json.dumps(to_return)

@post('/move')
def post_move():
    start = request.json.get('start')
    end = request.json.get('end')
    is_white = request.json.get('isWhite')

    move = GameEngine.isValidMove(GameEngine.getInitialState(), is_white, start, end)

    # if move >= 3:
        # update state

    response.content_type = 'application/json'
    return models.move_response_to_json(move)


@post('/newgame')
def new_game():

    return {'created': ''}

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
