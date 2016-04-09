import logging

from google.appengine.ext import ndb


class Comment(ndb.Model):
    created = ndb.DateTimeProperty(auto_now_add=True)
    text = ndb.StringProperty()
    author = ndb.StringProperty()

class Gameboard(ndb.Model):
    # gameID = ndb.IntegerProperty()
    isWhite = ndb.BooleanProperty()
    timestamp = ndb.DateTimeProperty(auto_now_add=True)
    board = ndb.JsonProperty()

def comment_to_json(comment):
    return {
        'key': comment.key.urlsafe(),
        'created': str(comment.created),
        'text': comment.text,
        'author': comment.author
    }

def move_response_to_json(move):
    return {
        'move': move
    }