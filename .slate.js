const config = { windowHintsDuration: 3 }
S.cfga(config)

const pushRight = S.op('push', {
  direction: 'right',
  style: 'bar-resize:screenSizeX/2',
});

const pushRightThird = S.op('push', {
  direction: 'right',
  style: 'bar-resize:screenSizeX/3',
});

const pushLeft = S.op('push', {
  direction: 'left',
  style: 'bar-resize:screenSizeX/2',
});

const pushLeftThird = S.op('push', {
  direction: 'left',
  style: 'bar-resize:screenSizeX/3',
});

const fullScreen = S.op('move', {
  x: 'screenOriginX',
  y: 'screenOriginY',
  width: 'screenSizeX',
  height: 'screenSizeY',
});

const move = (win, options) => win.doOperation(fullScreen.dup(options));

const getScreenInfo = () => {
  const screen = S.screen()
  const currentScreenId = screen.id();
  const { height: screenHeight, width: screenWidth } = screen.visibleRect();

  return { currentScreenId, prevId: currentScreenId - 1, nextId: currentScreenId + 1, screenHeight, screenWidth }
}

const getWindowInfo = win => {
  const {screenHeight, screenWidth, currentScreenId} = getScreenInfo();
  const topLeft = win.topLeft();
  const displaysArr = [...Array(S.screenCount()).keys()].reverse();
  const { height: windowHeight, width: windowWidth } = win.size();

  return {
    snappedToLeftEdge: Math.abs(topLeft.x) === screenWidth * displaysArr[currentScreenId],
    snappedToRightEdge: Math.abs(topLeft.x) === windowWidth,
    fullHeightApp: Math.abs(windowHeight - screenHeight) < 5,
    windowIsHalfOrSmaller: windowWidth <= screenWidth / 2,
    windowIsHalf: windowWidth === screenWidth / 2,
  };
}

let snapTo = null;
let timeout = null;

slate.on("windowFocused", (_, win) => {
  if (!snapTo) return;

  move(win, {screen: getScreenInfo().currentScreenId})
  if (snapTo === 'right') win.doOperation(pushRight)
  if (snapTo === 'left') win.doOperation(pushLeft)
});

const showHint = (win, snapToPosition) => {
  clearTimeout(timeout);
  
  timeout = setTimeout(() => {
    win.doOperation(S.op('hint'));
    snapTo = snapToPosition;

    setTimeout(() => {
      snapTo = null;
    }, config.windowHintsDuration * 1000);
  }, 1000);
}

const moveToLeft = win => {
  const {prevId, currentScreenId} = getScreenInfo();
  const {snappedToLeftEdge, fullHeightApp, windowIsHalfOrSmaller, windowIsHalf} = getWindowInfo(win);

  const lastScreen = currentScreenId === 0;

  if (snappedToLeftEdge) {
    if (lastScreen) {
      if (windowIsHalf) return win.doOperation(pushLeftThird);
    } else {
      showHint(win, 'left');
      
      if (windowIsHalfOrSmaller && fullHeightApp)
        return move(win, { x: 'screenOriginX+screenSizeX/2', width: 'screenSizeX/2', screen: prevId });
    }
  }

  showHint(win, 'right');
  win.doOperation(pushLeft);

}

const moveToRight = win => {
  const {nextId, screenHeight, screenWidth, currentScreenId} = getScreenInfo();
  const {snappedToRightEdge, fullHeightApp, windowIsHalfOrSmaller, windowIsHalf} = getWindowInfo(win);

  const lastScreen = currentScreenId === 1;

  if (snappedToRightEdge) {

    if (lastScreen && windowIsHalf) return win.doOperation(pushRightThird);
  
    if (windowIsHalfOrSmaller && fullHeightApp) {
      showHint(win, 'right');
      move(win, { width: 'screenSizeX/2', screen: nextId });
      return;
    };
  }
  
  showHint(win, 'left');
  win.doOperation(pushRight);

}

const leftHalfOfLeftDisplay = win => {
  move(win, { width: 'screenSizeX/2', screen: getScreenInfo().prevId });
};

const rightHalfOfRightDisplay = win => {
  move(win, { x: 'screenOriginX+screenSizeX/2', width: 'screenSizeX/2', screen: getScreenInfo().nextId });
}

const moveToRightDisplayFullscreen = win => move(win, { screen: getScreenInfo().nextId });

const moveToLeftDisplayFullscreen = win => move(win, { screen: getScreenInfo().prevId });

S.bnda({
  // CMD+ALT+UP Полноэкранный режим на конкретом экране
  'up:cmd;alt': fullScreen,
  // CMD+ALT+RIGHT Полноэкранный режим на следующем экране
  'right:cmd;alt': moveToRightDisplayFullscreen,
  // CMD+ALT+LEFT Полноэкранный режим на предыдущем экране
  'left:cmd;alt': moveToLeftDisplayFullscreen,
  // CMD+CTRL+LEFT Левая половина на конкретом экране или правая - при переходе на предыдущий экран
  'left:cmd;ctrl': moveToLeft,
  // CMD+CTRL+RIGHT Правая половина на конкретом экране или левая - при переходе на следующий экран
  'right:cmd;ctrl': moveToRight,
  // CMD+ALT+CTRL+LEFT Левая половина предыдущего экрана
  'left:cmd;alt;ctrl': leftHalfOfLeftDisplay,
  // CMD+ALT+CTRL+RIGHT Правая половина следующего экрана
  'right:cmd;alt;ctrl': rightHalfOfRightDisplay,  
})