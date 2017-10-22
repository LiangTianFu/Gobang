var chessBoard = []; //二维数组
var me = true;
var over = false;
//赢法数组
var wins = [];

//赢法统计数组
var myWin = [];
var computerWin = [];

for (var i = 0; i < 15; i++) {
  chessBoard[i] = [];
  for (var j = 0; j < 15; j++) {
    chessBoard[i][j] = 0;
  }
}

for (var i = 0; i < 15; i++) {
  wins[i] = [];
  for (var j = 0; j < 15; j++) {
    wins[i][j] = [];
  }
}
//赢法总数
var count = 0;

//横线
for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[i][j + k][count] = true;
    }
    count++;
  }
}

//所有竖线的赢法
for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[j + k][i][count] = true;
    }
    count++;
  }
}

//所有斜线的赢法
for (var i = 0; i < 11; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[i + k][j + k][count] = true;
    }
    count++;
  }
}

//所有反斜线的赢法
for (var i = 0; i < 11; i++) {
  for (var j = 14; j > 3; j--) {
    for (var k = 0; k < 5; k++) {
      wins[i + k][j - k][count] = true;
    }
    count++;
  }
}

console.log('该五子棋共有' + count + '种赢法');

for (var i = 0; i < count; i++) {
  //初始化为0
  myWin[i] = 0;
  computerWin[i] = 0;
}

var chess = document.getElementById('chess');
var context = chess.getContext('2d');


//棋盘线条颜色
context.strokeStyle = "#BFBFBF";
var logo = new Image();
logo.src = "images/logo1.png";
//加载图片需要有时间 在加载完图片回调函数
logo.onload = function() {
  context.drawImage(logo, 0, 0, 450, 450);
  drawChessBoard(); //加载完图片调用；

  // oneStep(0, 0, true); //在(0,0)调用黑棋
  // oneStep(1, 1, false); //在(1,1)调用白棋
}

var drawChessBoard = function() {
  //15个交叉点，14个白色方格，每个方格30像素，两边留白15个像素
  for (var i = 0; i < 15; i++) {
    //横线棋盘
    context.moveTo(15 + i * 30, 15);
    context.lineTo(15 + i * 30, 435);
    context.stroke();
    //纵（竖）线棋盘
    context.moveTo(15, 15 + i * 30);
    context.lineTo(435, 15 + i * 30);
    context.stroke();
  }
}

//i,j代表索引  me表示黑棋还是白棋
var oneStep = function(i, j, me) {
  //画圆
  context.beginPath();
  //context.arc(圆的中心的 x 坐标,圆的中心的 y 坐标,r,起始角,结束角,
  //counterclockwise逆时针还是顺时针绘图。 False = 顺时针， true = 逆时针);
  //context.arc(200, 200, 100, 0, 2 * Math.PI);
  context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
  context.closePath();
  //棋子t填充渐变色       //圆1 圆2(x1,y1,r1,x2,y2,r2)
  //  var gradient = context.createRadialGradient(200, 200, 50, 200, 200, 20);
  var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
  if (me) { //黑棋
    gradient.addColorStop(0, "#0A0A0A"); //0代表百分比
    gradient.addColorStop(1, "#636766");
  } else { //白棋
    gradient.addColorStop(0, "#D1D1D1"); //0代表百分比
    gradient.addColorStop(1, "#F9F9F9");
  }

  context.fillStyle = gradient; //context.stroke();描边
  context.fill(); //填充
}

chess.onclick = function(e) {
  if (over) {
    return;
  }
  if (!me) {
    return;
  }
  var x = e.offsetX;
  var y = e.offsetY;
  var i = Math.floor(x / 30); //Math.floor向下取整
  var j = Math.floor(y / 30);

  //方法一:让点击过的坐标无法执行第二次点击事件
  if (chessBoard[i][j] === 0) {
    oneStep(i, j, me);
    chessBoard[i][j] = 1;


    for (var k = 0; k < count; k++) {
      if (wins[i][j][k]) {
        myWin[k]++;
        computerWin[k] == 6;
        if (myWin[k] == 5) {
          window.alert('恭喜你获得了本局比赛的胜利！');
          over = true;
        }
      }
    }
    if (!over) {
      me = !me;
      computerAI();
    }
  }
}
var computerAI = function() {
  var myScore = [];
  var computerScore = [];
  var max = 0;
  var u = 0,
    v = 0;



  for (var i = 0; i < 15; i++) {
    myScore[i] = [];
    computerScore[i] = [];
    for (var j = 0; j < 15; j++) {
      myScore[i][j] = 0;
      computerScore[i][j] = 0;
    }
  }

  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      if (chessBoard[i][j] == 0) {
        for (var k = 0; k < count; k++) {
          if (wins[i][j][k]) {
            if (myWin[k] == 1) {
              myScore[i][j] += 200;
            } else if (myWin[k] == 2) {
              myScore[i][j] += 400;
            } else if (myWin[k] == 3) {
              myScore[i][j] += 2000;
            } else if (myWin[k] == 4) {
              myScore[i][j] += 10000;
            }

            // if (computerWin[k] == 1) {
            //   computerScore[i][j] += 220;
            // } else if (computerWin[k] == 2) {
            //   computerScore[i][j] += 440;
            // } else if (computerWin[k] == 3) {
            //   computerScore[i][j] += 2100;
            // } else if (computerWin[k] == 4) {
            //   computerScore[i][j] += 20000;
            // }
            if (computerWin[k] == 1) {
              computerScore[i][j] += 220;
            } else if (computerWin[k] == 2) {
              computerScore[i][j] += 420;
            } else if (computerWin[k] == 3) {
              computerScore[i][j] += 2100;
            } else if (computerWin[k] == 4) {
              computerScore[i][j] += 20000;
            }
          }
        }
        if (myScore[i][j] > max) {
          max = myScore[i][j];
          u = i;
          v = j;
        } else if (myScore[i][j] == max) {
          if (computerScore[i][j] > computerScore[u][v]) {
            u = i;
            v = j;
          }
        }
        if (computerScore[i][j] > max) {
          max = computerScore[i][j];
          u = i;
          v = j;
        } else if (computerScore[i][j] == max) {
          if (myScore[i][j] > myScore[u][v]) {
            u = i;
            v = j;
          }
        }
      }
    }
  }


  oneStep(u, v, false);
  chessBoard[u][v] = 2;

  for (var k = 0; k < count; k++) {
    if (wins[u][v][k]) {
      computerWin[k]++;
      myWin[k] = 6;
      if (computerWin[k] == 5) {
        window.alert('很遗憾！挑战失败，计算机获得胜利！');
        over = true;
      }
    }
  }
  if (!over) {
    me = !me;
  }
}
//方法二:区分判断是黑子还是白子
// if (chessBoard[i][j] == 0) {
//   oneStep(i, j, me);
//   if (me) {
//     chessBoard[i][j] = 1;
//   } else {
//     chessBoard[i][j] = 2;
//   }
//   me = !me;
// }
