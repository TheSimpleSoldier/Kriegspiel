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
tempState = [0] * 32
tempState[0] = 28
tempState[16] = 37
print str(inCheck(tempState, True)) + " = True"
tempState[16] = 46
print str(inCheck(tempState, True)) + " = False"

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
check3State = [0] * 32
check3State[4] = 11
check3State[16] = 5
check3State[24] = 12
check3State[25] = 13
check3State[26] = 14
print str(inCheckMate(check3State, False)) + " = False"
check3State = [0] * 32
check3State[4] = 15
check3State[16] = 32
check3State[24] = 23
check3State[25] = 31
check3State[26] = 39
print str(inCheckMate(check3State, False)) + " = False"

print "check"
checkState = [0] * 32
checkState[0] = 1
checkState[18] = 4
checkState[2] =16 
print str(isValidMove(checkState, True, 16, 8)) + " = 2"
checkState[1] = 2
print str(isValidMove(checkState, True, 16, 8)) + " = 3"

print "pawn locs"
attackState = [0] * 32
attackState[8] = 10
attackState[17] = 3
attackState[18] = 1
attackState[24] = 15
attackState[1] = 22
attackState[2] = 24
print str(pawnAttacks(attackState, True)) + " = [3,1]"
print str(pawnAttacks(attackState, False)) + " = [24,22]"
print str(pawnAttacks(getInitialState(), False)) + " = []"

print "check locs"
checkState = [0] * 32
checkState[0] = 36
checkState[17] = 9
checkState[18] = 39
checkState[19] = 28
checkState[20] = 21
checkState[22] = 50
print str(inCheckLocs(checkState, True)) + " = [27,37,28,29,43]"
