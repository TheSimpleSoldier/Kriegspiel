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

print str(isValidMove(state, True, 9, 17)) + " = 3"
print str(isValidMove(state, True, 9, 1)) + " = 0"
print str(isValidMove(state, True, 54, 46)) + " = 3"
print str(isValidMove(state, True, 5, 45)) + " = 1"
print str(isValidMove(state, True, 5, 44)) + " = 0"
