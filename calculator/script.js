const display = document.getElementById("result");

// Add sci-fi startup effect
window.addEventListener('load', function() {
    display.value = '> NEXUS CALC ONLINE';
    setTimeout(() => {
        display.value = '';
    }, 1500);
});

function appendValue(value) {
    if (display.value === '> NEXUS CALC ONLINE' || display.value === 'ERROR_OVERFLOW' || display.value === 'SYS_ERROR') {
        display.value = '';
    }
    display.value += value;
    playBeep('append');
}

function clearDisplay() {
    display.value = '';
    playBeep('clear');
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
    playBeep('delete');
}

function calculate() {
    try {
        if (display.value.length > 0) {
            const result = eval(display.value);
            if (result === Infinity || result === -Infinity) {
                display.value = 'ERROR_OVERFLOW';
            } else {
                display.value = result;
            }
            playBeep('calculate');
        }
    } catch (error) {
        display.value = 'SYS_ERROR';
        playBeep('error');
    }
}

// Sci-fi sound effects using Web Audio API
function playBeep(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    
    let frequency = 800;
    let duration = 0.1;
    
    switch(type) {
        case 'append':
            frequency = 1200;
            duration = 0.05;
            break;
        case 'delete':
            frequency = 600;
            duration = 0.08;
            break;
        case 'clear':
            frequency = 500;
            oscillator.type = 'square';
            duration = 0.1;
            break;
        case 'calculate':
            frequency = 1500;
            oscillator.type = 'sine';
            duration = 0.15;
            break;
        case 'error':
            frequency = 300;
            oscillator.type = 'square';
            duration = 0.2;
            break;
    }
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;

    if ((key >= '0' && key <= '9') || key === '+' || key === '-' || key === '*' || key === '/' || key === '.') {
        appendValue(key);
        event.preventDefault();
    } else if (key === 'Enter') {
        calculate();
        event.preventDefault();
    } else if (key === 'Backspace') {
        deleteLast();
        event.preventDefault();
    } else if (key === 'Escape') {
        clearDisplay();
        event.preventDefault();
    }
});