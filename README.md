# Chess
This is a chess game with additional rules. While this chess game pieces should follow all standard board rules, each piece also has a morale and allegiance attribute. If the morale attribute (0-100% value) is bellow a certain threshold, then the selected piece refuses to move, costing the player to lose a turn. For this project, we'll use random number generator to set the morale value each turn. The allegiance attribute (0-100% value) is a measure of how much the piece believes in the team's mission and wants to continue to be part of the same team. If a selected piece is about to be sacrificed, then the allegiance attribute decreases, in the opposite situation then this attribute increases. If the allegiance attribute falls below a certain threshold, then it will switches sides and becomes a piece of the opposing team. Let's make chess more fun!


## Used library:
- Chess.js 
https://github.com/jhlywa/chess.js
- Chessboard.js 
https://chessboardjs.com/

## Getting Start
Clone and open index.html in a browser.
