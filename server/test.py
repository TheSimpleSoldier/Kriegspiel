from GameEngine import *

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
print str(isValidMove(state, True, 4, 31)) + " = 3"
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
print "checkmate"
checkMateState = [0] * 32
checkMateState[0] = 1
checkMateState[18] = 4
checkMateState[19] = 12
print str(inCheckMate(checkMateState, True)) + " = True"
checkState = [0] * 32
checkState[0] = 1
checkState[18] = 4
print str(inCheckMate(checkState, True)) + " = False"
print str(inCheckMate(state, True)) + " = False"
check2State = [0] * 32
check2State[0] = 1
check2State[2] = 11
check2State[18] = 4
print str(inCheckMate(check2State, True)) + " = False"
check3State = [0] * 32
check3State[0] = 1
check3State[2] = 12
check3State[18] = 4
print str(inCheckMate(check3State, True)) + " = False"
