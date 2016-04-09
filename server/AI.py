import random
from GameEngine import *

def randomAI(positions, isWhite):
    fromLoc = 0
    toLoc = 0
    start = 0
    if(not isWhite):
        start = 16

    while(isValidMove(positions, isWhite, fromLoc, toLoc) < 3):
        loc = random.randrange(0, 16) + start
        fromLoc = positions[loc]
        toLoc = random.randrange(1, 65)

    return [fromLoc, toLoc]
