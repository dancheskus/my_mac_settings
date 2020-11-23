const pushRight = slate.operation('push', {
  direction: 'right',
  style: 'bar-resize:screenSizeX/2',
});

const pushRightThird = slate.operation('push', {
  direction: 'right',
  style: 'bar-resize:screenSizeX/3',
});

const pushLeft = slate.operation('push', {
  direction: 'left',
  style: 'bar-resize:screenSizeX/2',
});

const pushLeftThird = slate.operation('push', {
  direction: 'left',
  style: 'bar-resize:screenSizeX/3',
});

const defaultPosition = {
  x: 'screenOriginX',
  y: 'screenOriginY',
  width: 'screenSizeX',
  height: 'screenSizeY',
};

const fullscreen = slate.operation('move', defaultPosition);
const move = options => slate.operation('move', { ...defaultPosition, ...options });

// CMD+ALT+UP Полноэкранный режим на конкретом экране
slate.bind('up:cmd;alt', win => win.doOperation(fullscreen));

// CMD+ALT+LEFT Левая половина на конкретом экране или правая - при переходе на предыдущий экран
slate.bind('left:cmd;alt', win => {
  const screen = slate.screen();
  const currentScreenId = screen.id();
  const { height: screenHeight, width: screenWidth } = screen.visibleRect();

  const topLeft = win.topLeft();
  const { height: windowHeight, width: windowWidth } = win.size();

  const displaysArr = [...Array(slate.screenCount()).keys()].reverse();
  const snappedToLeftEdge = Math.abs(topLeft.x) === screenWidth * displaysArr[currentScreenId];
  const fullHeightApp = Math.abs(windowHeight - screenHeight) < 5;
  const windowIsHalfOrSmaller = windowWidth <= screenWidth / 2;
  const windowIsHalf = windowWidth === screenWidth / 2;
  const lastScreen = currentScreenId === 0;

  if (windowIsHalfOrSmaller && fullHeightApp && snappedToLeftEdge && !lastScreen)
    return win.doOperation(
      move({ x: 'screenOriginX+screenSizeX/2', width: 'screenSizeX/2', screen: currentScreenId - 1 })
    );

  if (snappedToLeftEdge && lastScreen && windowIsHalf) return win.doOperation(pushLeftThird);

  win.doOperation(pushLeft);
});

// CMD+ALT+RIGHT Правая половина на конкретом экране или левая - при переходе на следующий экран
slate.bind('right:cmd;alt', win => {
  const screen = slate.screen();
  const currentScreenId = screen.id();
  const { height: screenHeight, width: screenWidth } = screen.visibleRect();

  const topLeft = win.topLeft();
  const { height: windowHeight, width: windowWidth } = win.size();

  const snappedToRightEdge = Math.abs(topLeft.x) === windowWidth;
  const fullHeightApp = Math.abs(windowHeight - screenHeight) < 5;
  const windowIsHalfOrSmaller = windowWidth <= screenWidth / 2;
  const windowIsHalf = windowWidth === screenWidth / 2;
  const lastScreen = currentScreenId === 1;

  if (snappedToRightEdge && lastScreen && windowIsHalf) return win.doOperation(pushRightThird);

  if (windowIsHalfOrSmaller && fullHeightApp && snappedToRightEdge)
    return win.doOperation(move({ width: 'screenSizeX/2', screen: currentScreenId + 1 }));

  win.doOperation(pushRight);
});

// CMD+ALT+CTRL+LEFT Левая половина предыдущего экрана
slate.bind('left:cmd;alt;ctrl', win => {
  const currentScreenId = slate.screen().id();

  win.doOperation(move({ width: 'screenSizeX/2', screen: currentScreenId - 1 }));
});

// CMD+ALT+CTRL+RIGHT Правая половина следующего экрана
slate.bind('right:cmd;alt;ctrl', win => {
  const currentScreenId = slate.screen().id();

  win.doOperation(move({ x: 'screenOriginX+screenSizeX/2', width: 'screenSizeX/2', screen: currentScreenId + 1 }));
});

// CMD+CTRL+RIGHT Полноэкранный режим на следующем экране
slate.bind('right:cmd;ctrl', win => {
  const currentScreenId = slate.screen().id();

  win.doOperation(move({ screen: currentScreenId + 1 }));
});

// CMD+CTRL+LEFT Полноэкранный режим на предыдущем экране
slate.bind('left:cmd;ctrl', win => {
  const currentScreenId = slate.screen().id();

  win.doOperation(move({ screen: currentScreenId - 1 }));
});
