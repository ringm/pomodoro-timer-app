//--------variables----------//

let time;
let timer;
let isRunning = false;
let pomoCount = 1;
let currentSec;
const pill = document.querySelector('#pill');
let totalSec = 0;
let totalMin = 0;
let m = 0;
const stroke = document.querySelector('#progress-stroke');
const tabTitle = document.querySelector('#tab-title');
const btn = document.querySelector('#control');
const totalWork = document.querySelector('#total-work');
const restart = document.querySelector('#restart');
const settingsBtn = document.querySelector('#settings');
const settingsContainer = document.querySelector('#settingsContainer');
const settingsBox = document.querySelector('#settingsContainer');
const closeSettings = document.querySelector('#closeSettings');
const timeOutput = document.querySelector('#time-output');
const timerTypes = Array.from(document.querySelectorAll('.timer-radio'));
const timerLabels = Array.from(document.querySelectorAll('.timer-label'));
const timeSettings = Array.from(document.querySelectorAll('.time-setting'));
const applyBtn = document.querySelector('#apply');
const colors = Array.from(document.querySelectorAll('.color-radio'));
const fonts = Array.from(document.querySelectorAll('.font-radio'));
let duration = 1;
let progress;

//--------functions----------//

function setTime() {
  if(isRunning) {
    stopCountdown();
  }

  timerTypes.map((timer, i) => {

    let min = timeSettings[i].value < 10 ? `0${timeSettings[i].value}` : timeSettings[i].value;
    timer.checked ? timeOutput.textContent = `${min}:00` : '';

    if(timer.checked) {
      duration = parseInt(min) * 60 * 1000;
    }

  });

  progress = anime({
    targets: '#progress-stroke',
    strokeDashoffset: [anime.setDashoffset, 0],
    strokeDasharray: {
      value: '755',
    },
    easing: 'linear',
    duration: duration,
    direction: 'alternate',
    loop: false,
    autoplay: false,
  });

  stroke.style.strokeDasharray = '755';
  stroke.style.strokeDashoffset = '755';

  btn.textContent = 'start';

}

function applySettings() {

  //set time
  if(!isRunning) {
    setTime();
  }

  //set color
  colors.map(color => color.checked == true ? document.documentElement.style.setProperty('--color', color.dataset.color) : null);

  //set font
  fonts.map(font => font.checked == true ? document.documentElement.style.setProperty('--font', font.dataset.font) : null);

  setTimeout(movePill, 0);
  settingsContainer.classList.add('hidden');
}

function startCountdown() {
  isRunning = true;

  time = (parseInt(timeOutput.textContent.split(":")[0]) * 60) + parseInt(timeOutput.textContent.split(":")[1]);
  updateCountdown();

  timer = setInterval(updateCountdown, 1000);

  progress.play();
  btn.textContent = 'pause';
}

function updateCountdown() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  let text = timerTypes[0].checked ? 'Work' : 'Break';

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  timeOutput.textContent = `${minutes}:${seconds}`;
  tabTitle.textContent = `(${minutes}:${seconds}) ${text}`;
  time--;

  if(timerTypes[0].checked){

    currentSec = parseInt(totalWork.textContent.split(':')[1]);

    if(currentSec >= 59) {
      m++;
      totalSec = 0;
    }

    totalMin = m;

    totalMin = totalMin < 10 ? `0${totalMin}` : totalMin;
    totalSec = totalSec < 10 ? `0${totalSec}` : totalSec;

    totalWork.textContent = `${totalMin}:${totalSec}`;

    totalSec++;
  } else {
    totalSec = 0;
  }

  if(minutes == 0 && seconds == 0) {
    stopCountdown();
    nextClock();
  }
}

function stopCountdown() {
  isRunning = false;
  clearInterval(timer);
  btn.textContent = 'resume';
  tabTitle.textContent = `Pomodoro App`;
  restart.classList.remove('hidden');
  progress.pause();
}

function nextClock() {
    if(timerTypes[0].checked == true) {
        if(pomoCount == 4) {
          pomoCount = 1;
          timerTypes[2].checked = true;
        } else {
          timerTypes[1].checked = true;
        }
    } else {
      pomoCount++;
      timerTypes[0].checked = true;
    }
    anime({
      targets: '#progress-stroke',
      strokeDashoffset: {
        value: '-755',
        easing: 'easeOutQuart'
      },
      strokeDasharray: {
        value: '755',
        easing: 'easeOutQuart'
      },
      duration: 1000,
      direction: 'alternate',
      loop: false,
      autoplay: true,
      easing: 'easeOutQuart',
    });
    setTime();
    movePill();
    setTimeout(startCountdown, 1000);
}

function movePill() {
  for(var i = 0; i < timerTypes.length; i++){
    if(timerTypes[i].checked){

      const label = timerLabels[i].getBoundingClientRect();
      const coords = {
        width: label.width,
        left: label.left,
      }
      pill.style.setProperty('width', `${coords.width}px`);
      pill.style.setProperty('transform', `translateX(${coords.left}px)`);

    }
  }
}

//change time based on selected clock

timerLabels.forEach(label => label.addEventListener('click', function() {
  setTimeout(movePill, 0);
  setTimeout(setTime, 0);
}));

//start/pause timer

btn.addEventListener('click', () => {

  if(btn.textContent == 'start' || btn.textContent == 'resume') {

    if(btn.textContent == 'resume') {
      anime({
        targets: '#restart',
        opacity: ['100%', '0%'],
        duration: 500,
      });
    }

    startCountdown();

    restart.classList.remove('pointer-events-auto');
    restart.classList.add('pointer-events-none');
    
  } else if(btn.textContent == 'pause') {

    restart.classList.remove('pointer-events-none');
    restart.classList.add('pointer-events-auto');

    anime({
      targets: '#restart',
      translateY: [-10, 0],
      duration: 350,
      opacity: ['0%', '100%'],
      easing: 'easeOutExpo',
    });

    stopCountdown();
    totalSec--;

  }
});

restart.addEventListener('click', () => {
  progress.pause();
  anime({
    targets: '#progress-stroke',
    strokeDashoffset: {
      value: '755',
      easing: 'easeOutExpo'
    },
    strokeDasharray: {
      value: '755',
      easing: 'easeOutExpo'
    },
    duration: 500,
    direction: 'alternate',
    loop: false,
    easing: 'easeOutExpo',
  });

  anime({
    targets: '#restart',
    opacity: ['100%', '0%'],
    duration: 400,
  });

  restart.classList.remove('pointer-events-auto');
  restart.classList.add('pointer-events-none');

  totalWork.textContent = '00:00';
  totalSec = 0;
  m = 0;
  btn.textContent = 'start';

  setTime();
});

//open close settings

settingsBtn.addEventListener('click', () => {
  settingsContainer.classList.remove('hidden');
  anime({
    targets: '#settingsBox',
    opacity: '100%',
    translateY: [100, 0],
    easing: 'easeOutExpo',
    duration: 500,
  });
});

closeSettings.addEventListener('click', () => {
  settingsContainer.classList.add('hidden');
});

//apply settings

applyBtn.addEventListener('click', applySettings);

//apply current setting on load

applySettings();

window.onload = function() {
  timerLabels[0].click();
}

setTimeout(
  function() {
    timerLabels[0].click();
  }, 500
);

window.addEventListener('resize', () => movePill());
