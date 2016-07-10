'use babel';

export default class PomodoroAppView {
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('pomodoro-app');
    this.element.classList.add('inline-block');

    // Placeholder for timer buttons
    // Play/pause button
    let toggleButton = document.createElement('input');
    toggleButton.id = "toggle";
    toggleButton.setAttribute("type", "button");
    toggleButton.setAttribute("value", "Start/Pause");
    toggleButton.classList.add('inline-block');
    toggleButton.style.backgroundColor = 'green';
    this.element.appendChild(toggleButton);

    // Stop button
    let stopButton = document.createElement('input');
    stopButton.setAttribute("type", "button");
    stopButton.setAttribute("value", "Stop");
    stopButton.classList.add('inline-block');
    stopButton.style.backgroundColor = 'red';
    this.element.appendChild(stopButton);

    // Create timer block
    this.timer = atom.config.get("atom-pomodoro-app.startTime") + ":" + "00";
    let message = document.createElement('div');
    message.style.margin = "0px 3px";
    message.classList.add('inline-block');
    message.id = "timer";
    message.textContent = this.timer;
    this.element.appendChild(message);
  }

  setTime(time) {
    if (time.match(/^\d\d:\d\d$/g)) {
      this.element.children[2].textContent = time;
    }
    return console.log('time set');
  }

  getTimerContainer() {
    return this.element.children[2];
  }

  getStopButton() {
    return this.element.children[1];
  }

  getToggleButton() {
    return this.element.children[0];
  }
  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    return this.element.remove();
  }

  getElement() {
    return this.element;
  }
};
