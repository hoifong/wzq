## 游戏核心模块

### Game类：
Game类的定义为一个游戏房间，包含以下必要属性：
+   `host：Player`:房主
+   `roomState：RoomState`:房间状态
+   `whiteSide：Player`:白方玩家
+   `blackSide：Player`:黑方玩家
+   `whiteSteps：Array<Point>`:白方落子记录
+   `blackSteps：Array<Point>`:黑方落子记录
+   `countDown：number`:落子倒计时（ms）
+   以及其他属性...

### Player类：
Player类定义为一个玩家，包含以下属性：
+   `info：PlayerInfo`:用户信息
+   `game：Game`:所在游戏，没有在游戏中即为null


### 游戏状态定义：
+   `INIT`:房间初始化至双方玩家中一玩家准备前
+   `WAITING`:双方玩家其中一方准备至开始游戏
+   `GAMING`:游戏开始
+   `OVER`:游戏结束

### 游戏流程：
+   玩家1创建游戏房间--此时创建了一个Game实例（游戏状态初始化为`INIT`，房主为玩家1）并挂载到该玩家的game属性下（并与自己绑定）；
+   玩家2加入玩家1创建的游戏房间--将自己绑定到对应Game实例（此时游戏状态为`INIT`）
+   玩家2准备--游戏状态变为`WAITING`
+   玩家1开始游戏--游戏状态变为`GAMING`，并开始落子倒计时,先手玩家在倒计时结束前落子
+   玩家落子--判断是否出现赢方，重新开始落子倒计时
+   若出现赢方或某方超时--游戏结束