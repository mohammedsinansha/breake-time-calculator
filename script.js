function addBreak() {
    const breakContainer = document.getElementById('break-container');
    const breakDiv = document.createElement('div');
    breakDiv.className = 'break-input';
    breakDiv.style.marginBottom = '10px';

    breakDiv.innerHTML = `
        <label>Start Time:</label>
        <input type="time" class="break-start">
        <label>End Time:</label>
        <input type="time" class="break-end">
        <button type="button" onclick="removeBreak(this)" style="margin-left: 10px;">Remove</button>
    `;

    breakContainer.appendChild(breakDiv);
    saveBreakData(); // Save the current state after adding a break
}

function removeBreak(button) {
    const breakContainer = document.getElementById('break-container');
    breakContainer.removeChild(button.parentElement);
    saveBreakData(); // Save the current state after removing a break
}

function calculateBreakTime() {
    const breakStartTimes = document.querySelectorAll('.break-start');
    const breakEndTimes = document.querySelectorAll('.break-end');
    let totalBreakTime = 0;

    for (let i = 0; i < breakStartTimes.length; i++) {
        const breakStart = breakStartTimes[i].value;
        const breakEnd = breakEndTimes[i].value;

        if (breakStart && breakEnd) {
            // Parsing start and end times as dates
            const breakStartDate = new Date(`1970-01-01T${breakStart}:00`);
            const breakEndDate = new Date(`1970-01-01T${breakEnd}:00`);

            if (breakEndDate < breakStartDate) {
                alert("Break end time cannot be before break start time.");
                return;
            }

            // Calculating duration in minutes
            const breakDuration = (breakEndDate - breakStartDate) / (1000 * 60); // Convert to minutes
            totalBreakTime += breakDuration;
        }
    }

    const allowedBreakTime = 90; // 1.5 hours in minutes
    const resultElement = document.getElementById('result');
    let remainingBreakTime = allowedBreakTime - totalBreakTime;

    if (remainingBreakTime >= 0) {
        resultElement.textContent = `You have taken a total of ${totalBreakTime} minutes of break time. You have ${remainingBreakTime} minutes of break time left.`;
        resultElement.className = remainingBreakTime === 0 ? 'result green' : 'result orange';
    } else {
        resultElement.textContent = `You have taken a total of ${totalBreakTime} minutes of break time, exceeding the allowed break time by ${-remainingBreakTime} minutes.`;
        resultElement.className = 'result red';
    }

    // Save data after calculation
    saveBreakData();
}

// Function to save break data to localStorage
function saveBreakData() {
    const breakStartTimes = Array.from(document.querySelectorAll('.break-start')).map(input => input.value);
    const breakEndTimes = Array.from(document.querySelectorAll('.break-end')).map(input => input.value);
    const data = {
        breakStartTimes,
        breakEndTimes,
        timestamp: new Date().getTime() // current timestamp
    };
    localStorage.setItem('breakData', JSON.stringify(data));
}

// Function to load break data from localStorage
function loadBreakData() {
    const data = JSON.parse(localStorage.getItem('breakData'));
    if (data) {
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - data.timestamp;

        // Check if data is older than 24 hours (86400000 ms)
        if (timeElapsed > 86400000) {
            localStorage.removeItem('breakData');
        } else {
            const breakContainer = document.getElementById('break-container');
            breakContainer.innerHTML = ''; // Clear existing inputs

            data.breakStartTimes.forEach((start, index) => {
                const breakDiv = document.createElement('div');
                breakDiv.className = 'break-input';
                breakDiv.style.marginBottom = '10px';
                breakDiv.innerHTML = `
                    <label>Start Time:</label>
                    <input type="time" class="break-start" value="${start}">
                    <label>End Time:</label>
                    <input type="time" class="break-end" value="${data.breakEndTimes[index]}">
                    <button type="button" onclick="removeBreak(this)" style="margin-left: 10px;">Remove</button>
                `;
                breakContainer.appendChild(breakDiv);
            });
        }
    }
}

// Load data when the page loads
window.onload = loadBreakData;
