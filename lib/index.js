import { CompositeDisposable } from 'atom';

import PomodoroAppView from './pomodoro-app-view';
import Timer from './timer';

export default {
  config: {
    startTime: {
      type: 'integer',
      default: 25,
      minimum: 0,
      maximum: 60,
    },
    smallBreak: {
      type: 'integer',
      default: 5,
      minimum: 0,
      maximum: 60,
    },
    longBreak: {
      type: 'integer',
      default: 25,
      minimum: 0,
      maximum: 60,
    },
  },

  pomodoroAppView: null,
  subscriptions: null,
  localStatusBarTile: null,
  togleButton: null,
  stopButton: null,
  timer: null,

  activate(state) {
    this.pomodoroAppView = new PomodoroAppView(state.pomodoroAppViewState);
    this.timer = new Timer(atom.config.get("atom-pomodoro-app.startTime"), this.pomodoroAppView.getTimerContainer());
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {['atom-pomodoro-app:toggleTimer']: () => this.toggleTimer()}));
    this.subscriptions.add(atom.commands.add('atom-workspace', {['atom-pomodoro-app:stopTimer']: () => this.stopTimer()}));
    // Assigning event listeners
    this.togleButton = this.pomodoroAppView.getToggleButton();
    this.stopButton = this.pomodoroAppView.getStopButton();
    this.togleButton.addEventListener('click', () =>this.toggleTimer());
    this.stopButton.addEventListener('click', () =>this.stopTimer());
    return this.stopButton.disabled = true;
  },
    // This code will be used for registering commands (using ctrl+shift+p).
    // # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    // @subscriptions = new CompositeDisposable
    //
    // # Register command that toggles this view
    // @subscriptions.add atom.commands.add 'atom-workspace', 'pomodoro-app:toggle': => @toggle()

  deactivate() {
    this.subscriptions.dispose();
    this.pomodoroAppView.destroy(); // All hell goes loose
    this.statusBarTile.destroy();
    return this.statusBarTile = null;
  },

  serialize() {
    return {pomodoroAppViewState: this.pomodoroAppView.serialize()};
  },

  consumeStatusBar(statusBar) {
    return this.localStatusBarTile = statusBar.addRightTile({item: this.pomodoroAppView.getElement(), priority: 100});
  },

  toggleTimer() {
    this.timer.toggle();
    return this.stopButton.disabled = false;
  },

  stopTimer() {
    this.timer.reset();
    return this.stopButton.disabled = true;
  }
};


  // toggle: ->
  //   console.log 'PomodoroApp was toggled!'
