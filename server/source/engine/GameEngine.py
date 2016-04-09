def isValidMove(positions, whiteTurn, startPos, endPos):
    loc = 0
    for loc in range(0, 32):
        if(positions[loc] == startPos):
            break
    if(loc == 0 or loc == 16):
        # king move
        toReturn = 0
        if(move(startPos, 1, 1) == endPos):
            toReturn =  move(startPos(1, 1))
        elif(move(startPos, -1, 1) == endPos):
            toReturn =  move(startPos(-1, 1))
        elif(move(startPos, 1, -1) == endPos):
            toReturn =  move(startPos(1, -1))
        elif(move(startPos, -1, -1) == endPos):
            toReturn =  move(startPos(-1, -1))
        elif(move(startPos, 1, 0) == endPos):
            toReturn =  move(startPos(1, 0))
        elif(move(startPos, 0, 1) == endPos):
            toReturn =  move(startPos(0, 1))
        elif(move(startPos, -1, 0) == endPos):
            toReturn =  move(startPos(-1, 0))
        elif(move(startPos, 0, -1) == endPos):
            toReturn =  move(startPos(0, -1))

        if(toReturn == 0):
            return 0
        
        newPositions = list(positions)
        if(checkPos(toReturn) != -1):
            newPositions[checkPos(toReturn)] = 0
        newPositions[loc] = toReturn
        if(not inCheck(positions, whiteTurn)):
            return 3 + checkPos(toReturn)
        else:
            return 2

    elif(loc == 1 or loc == 17):
        # queen move
        up = moveMany(positions, startPos, endPos, 0, -1)
        if(up != -1):
            return up
        down = moveMany(positions, startPos, endPos, 0, 1)
        if(down != -1):
            return down
        right = moveMany(positions, startPos, endPos, 1, 0)
        if(right != -1):
            return right
        left = moveMany(positions, startPos, endPos, -1, 0)
        if(left != -1):
            return left
        upLeft = moveMany(positions, startPos, endPos, -1, -1)
        if(upLeft != -1):
            return upLeft
        downLeft = moveMany(positions, startPos, endPos, -1, 1)
        if(downLeft != -1):
            return downLeft
        upRight = moveMany(positions, startPos, endPos, 1, -1)
        if(upRight != -1):
            return upRight
        downLeft = moveMany(positions, startPos, endPos, -1, 1)
        if(downLeft != -1):
            return downLeft
        return 0

    elif(loc == 2 or loc == 3 or loc == 18 or loc == 19):
        # rook move
        up = moveMany(positions, startPos, endPos, 0, -1)
        if(up != -1):
            return up
        down = moveMany(positions, startPos, endPos, 0, 1)
        if(down != -1):
            return down
        right = moveMany(positions, startPos, endPos, 1, 0)
        if(right != -1):
            return right
        left = moveMany(positions, startPos, endPos, -1, 0)
        if(left != -1):
            return left
        return 0

    elif(loc == 4 or loc == 5 or loc == 20 or loc == 21):
        # knight move
        if(moveLoc != -1 and move(startPos, 1, 2) == endPos):
            return  4 + checkPos(positions, move(startPos(1, 2)))
        if(moveLoc != -1 and move(startPos, -1, 2) == endPos):
            return  4 + checkPos(positions, move(startPos(-1, 2)))
        if(moveLoc != -1 and move(startPos, 1, -2) == endPos):
            return  4 + checkPos(positions, move(startPos(1, -2)))
        if(moveLoc != -1 and move(startPos, -1, -2) == endPos):
            return  4 + checkPos(positions, move(startPos(-1, -2)))
        if(moveLoc != -1 and move(startPos, 2, 1) == endPos):
            return  4 + checkPos(positions, move(startPos(2, 1)))
        if(moveLoc != -1 and move(startPos, -2, 1) == endPos):
            return  4 + checkPos(positions, move(startPos(-2, 1)))
        if(moveLoc != -1 and move(startPos, 2, -1) == endPos):
            return  4 + checkPos(positions, move(startPos(2, -1)))
        if(moveLoc != -1 and move(startPos, -2, -1) == endPos):
            return  4 + checkPos(positions, move(startPos(-2, -1)))
        return 0

    elif(loc == 6 or loc == 7 or loc == 22 or loc == 23):
        # bishop move
        upLeft = moveMany(positions, startPos, endPos, -1, -1)
        if(upLeft != -1):
            return upLeft
        downLeft = moveMany(positions, startPos, endPos, -1, 1)
        if(downLeft != -1):
            return downLeft
        upRight = moveMany(positions, startPos, endPos, 1, -1)
        if(upRight != -1):
            return upRight
        downLeft = moveMany(positions, startPos, endPos, -1, 1)
        if(downLeft != -1):
            return downLeft
        return 0

    elif(loc == 8 or loc == 9 or loc == 10 or loc == 11 or loc == 12 or loc == 13 or loc == 14 or loc == 15):
        # white pawn
        moveLoc = move(startPos, 0, -1)
        if(moveLoc != -1 and moveLoc == endPos and checkPos(positions, moveLoc) == -1):
            return 3
        if(moveLoc != -1 and moveLoc == endPos and checkPos(positions, moveLoc) != -1):
            return 1
        moveLoc = move(startPos, 1, -1)
        if(moveLoc != -1 and moveLoc == endPos and checkPos(positions, moveLoc) != -1):
            return 4 + checkPos(positions, moveLoc)
        moveLoc = move(startPos, -1, -1)
        if(moveLoc != -1 and moveLoc == endPos and checkPos(positions, moveLoc) != -1):
            return 4 + checkPos(positions, moveLoc)
        return 0

    else:
        # black pawn
        moveLoc = move(startPos, 0, 1)
        if(moveLoc != -1 and moveLoc == endPos and checkPos(positions, moveLoc) == -1):
            return 3
        if(moveLoc != -1 and moveLoc == endPos and checkPos(positions, moveLoc) != -1):
            return 1
        moveLoc = move(startPos, 1, 1)
        if(moveLoc != -1 and moveLoc == endPos and checkPos(positions, moveLoc) != -1):
            return 4 + checkPos(positions, moveLoc)
        moveLoc = move(startPos, -1, 1)
        if(moveLoc != -1 and moveLoc == endPos and checkPos(positions, moveLoc) != -1):
            return 4 + checkPos(positions, moveLoc)
        return 0

def moveMany(positions, startPos, endPos, xMoveOne, yMoveOne):
    xMove = xMoveOne
    yMove = yMoveOne
    moveLoc = move(startPos, xMove, yMove)
    while(moveLoc != -1):
        if(moveLoc == endPos):
            return 4 + checkPos(positions, endPos)
        if(checkPos(positions, endPos) != -1):
            return 1
        xMove += xMoveOne
        yMove += yMoveOne
        moveLoc = move(startPos, xMove, yMove)

    return -1


def move(startPos, xMove, yMove):
    endPos = startPos
    if((endPos + xMove - 1) / 8 != (endPos - 1) / 8):
        return -1
    endPos += xMove
    endPos += (8 * yMove)
    if(endPos <= 0 or endPos > 64):
        return -1

    return endPos

def checkPos(positions, loc):
    for loc in range(0, 32):
        if(positions[loc] == loc):
            return loc
    return -1

def inCheck(positions, white):
    print "you are totally in check"
    loc = 0
    start = 17
    if(not white):
        loc = 16
        start = 1
    
    for k in range(0, 15):
        if(positions[start + k] != 0):
            if(isValidMove(positions, positions[start + k], positions[loc])):
                return True

    for k in range(-1,1):
        for a in range(-1,1):
            if(k != 0 and a != 0):
                if(move(positions[0], k, a) == positions[16]):
                    return True

    return False

def getInitialState():
    return [60, 61, 57, 64, 58, 63, 59, 62, 49, 50, 51, 52, 53, 54, 55, 56, 4, 5, 1, 8, 2, 7, 3, 6, 9, 10, 11, 12, 13, 14, 15, 16]
