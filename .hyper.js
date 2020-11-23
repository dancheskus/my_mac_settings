
module.exports = {
  config: {
    updateChannel: 'stable',

    // Font
    fontSize: 14,
    fontFamily: 'Fira Code, Menlo, "DejaVu Sans Mono", Consolas, "Lucida Console", monospace',
    fontWeight: 'normal',
    fontWeightBold: 'bold',
    lineHeight: 1,
    letterSpacing: 0,

    // Cursor
    cursorColor: 'rgba(248,28,229,0.8)',
    cursorAccentColor: '#000',
    cursorShape: 'BEAM',
    cursorBlink: false,

    // Styles
    foregroundColor: '#fff',
    backgroundColor: '#000',
    selectionColor: 'rgba(248,28,229,0.3)',
    borderColor: '#333',
    css: '',
    termCSS: '',
    padding: '12px 14px',
    colors: {
      black: '#000000',
      red: '#C51E14',
      green: '#1DC121',
      yellow: '#C7C329',
      blue: '#0A2FC4',
      magenta: '#C839C5',
      cyan: '#20C5C6',
      white: '#C7C7C7',
      lightBlack: '#686868',
      lightRed: '#FD6F6B',
      lightGreen: '#67F86F',
      lightYellow: '#FFFA72',
      lightBlue: '#6A76FB',
      lightMagenta: '#FD7CFC',
      lightCyan: '#68FDFE',
      lightWhite: '#FFFFFF',
    },

    showHamburgerMenu: '',
    showWindowControls: '',

    // shell
    shell: 'C:\\Windows\\System32\\bash.exe',
    shellArgs: ['--login'],

    env: {},
    bell: 'SOUND',
    copyOnSelect: false,
    defaultSSHApp: true,
    quickEdit: false,
    macOptionSelectionMode: 'vertical',
    webGLRenderer: true,
  },

  plugins: [
    'hyper-material-theme',
    // 'hypercwd', новая вкладка в той же дериктории - не работает с wsl
  ],

  localPlugins: [],

  keymaps: {
    // command для mac
    'tab:new': 'ctrl+n',
    'pane:splitVertical': 'ctrl+t',
    'pane:close': 'ctrl+w',
    'editor:undo': 'ctrl+z',
    'editor:copy': 'ctrl+c',
    'editor:paste': 'ctrl+v',
  },
};