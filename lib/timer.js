'use babel';

export default class Timer {
  // Keeps track of the timer's current state
  timerStateEnum = {
    default : 'default',
    running : 'running',
    paused : 'paused'
  };
  startTime = null;     // Start time of the current sequence
  tick = null;          // The interval inbetween times to calculate the change in time
  minutes = null;       // Initial amount of miniutes for the timer to be set to
  container = null;     // The container to be used for the timer display
  milliseconds = null;  // Time remaining in milliseconds
  timerState = null;    // Current state of the timer

  constructor(minutes, container) {
    this.activate = this.activate.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.increment = this.increment.bind(this);
    this.reset = this.reset.bind(this);
    this.toggle = this.toggle.bind(this);
    this.getState = this.getState.bind(this);
    this.timerState = this.timerStateEnum.default;
    this.minutes = minutes;
    this.milliseconds = minutes * 60 * 1000;         // Remaining time in milliseconds
    this.container = container;
  }

  // Starts the timer
  activate() {
    this.startTime = new Date().getTime();           // Set the start point of the current iteration
    this.container.textContent = this.minutes + ":00";
    return this.tick = setInterval(this.increment, 500);        // Start the timer
  }

  // Pauses the timer
  pause() {
    this.milliseconds = this.increment();                // Save the remaining time
    return clearInterval(this.tick);                        // Stops the timer from ticking
  }

  // Resumes the timer
  resume() {
    this.startTime = new Date().getTime();           // Reset the start point
    return this.tick = setInterval(this.increment, 500);        // Start ticking again
  }

  // Increases
  increment() {
    // Calculate new time remaining
    let now = Math.max(0, this.milliseconds-(new Date().getTime()-this.startTime));
    let minute = Math.floor(now/60000);
    let second = Math.floor(now/1000)%60;
    // 5 seconds will be 05 seconds
    second = (second < 10 ? "0" : "") + second;
    this.container.textContent = minute + ":" + second;
    if ( now === 0 ) {                             // Stop if no time remains, recursive
      clearInterval(this.tick);
      this.timerState = this.timerStateEnum.default;
      atom.notifications.addSuccess("Timer completed!");
      let temp = setInterval((() =>(
        this.container.style.backgroundColor = "green",
        setTimeout((() =>(this.container.style.backgroundColor = "")), 500))
      ), 1000);
      setTimeout((() => clearInterval(temp)), 5000);
    }

    return now;
  }

  // Used to restore the timer to the default state
  reset() {
    clearInterval(this.tick);
    this.container.textContent = this.minutes + ":00";
    this.milliseconds = this.minutes * 60 * 1000;
    return this.timerState = this.timerStateEnum.default;
  }

  toggle() {
    if (this.timerState === this.timerStateEnum.default) {
        this.timerState = this.timerStateEnum.running;
        return this.activate();
    } else if (this.timerState === this.timerStateEnum.paused) {
        this.timerState = this.timerStateEnum.running;
        return this.resume();
    } else {
        this.timerState = this.timerStateEnum.paused;
        return this.pause();
      }
  }

  getState() {
    return this.timerState;
  }
};
