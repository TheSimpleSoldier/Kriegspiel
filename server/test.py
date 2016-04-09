from GameEngine import *

def change(x):
    x2 = list(x)
    x2[2] = 5
    print x2

z = [1,1,1,1]
change(z)
print z

state = getInitialState()

print str(move(1, 1, 1)) + " = 10"
print str(move(1, -1, -1)) + " = -1"
print str(move(1, 0, -1)) + " = -1"
print str(move(35, -1, -1)) + " = 26"
print str(move(35, 3, 2)) + " = 54"
print str(move(64, 1, 1)) + " = -1"
print str(move(64, 0, 1)) + " = -1"

print "king"
print str(isValidMove(state, False, 5, 13)) + " = 1"
state[28] = 0
print str(isValidMove(state, False, 5, 13)) + " = 3"
print "black pawn"
print str(isValidMove(state, True, 9, 17)) + " = 3"
print str(isValidMove(state, True, 9, 1)) + " = 0"
print "white pawn"
print str(isValidMove(state, True, 54, 46)) + " = 3"
print "queen"
print str(isValidMove(state, True, 4, 44)) + " = 1"
print str(isValidMove(state, False, 4, 12)) + " = 1"
print str(isValidMove(state, True, 4, 31)) + " = 1"
print str(isValidMove(state, True, 4, 43)) + " = 0"
state[27] = 0
print str(isValidMove(state, False, 4, 52)) + " = 15"
print "rook"
print str(isValidMove(state, True, 57, 41)) + " = 1"
print str(isValidMove(state, True, 57, 42)) + " = 0"
print "bishop"
print str(isValidMove(state, True, 59, 45)) + " = 1"
print str(isValidMove(state, True, 59, 46)) + " = 0"
print "knight"
print str(isValidMove(state, True, 58, 43)) + " = 3"
print str(isValidMove(state, True, 58, 44)) + " = 0"
