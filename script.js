// =============================
// Smart Hostel Water Predictor
// =============================

// Default values
document.getElementById("people").value = 120;
document.getElementById("radius").value = 2;
document.getElementById("height").value = 4;
document.getElementById("depth").value = 3;
document.getElementById("hours").value = 8;
document.getElementById("temperature").value = 30;
document.getElementById("weekend").value = "no";
document.getElementById("exam").value = "no";

// Predict Button
document
    .getElementById("predictBtn")
    .addEventListener("click", calculateWater);

let resultsChart;

window.addEventListener('load', () => {
    setupChart();
    calculateWater();
});

function calculateWater() {

    // -----------------------------
    // Read Input Values
    // -----------------------------

    let people = parseFloat(document.getElementById("people").value) || 0;

    let radius = parseFloat(document.getElementById("radius").value) || 0;

    let height = parseFloat(document.getElementById("height").value) || 0;

    let depth = parseFloat(document.getElementById("depth").value) || 0;

    let peakHours = parseFloat(document.getElementById("hours").value) || 1;

    let temperature = parseFloat(document.getElementById("temperature").value) || 30;

    let weekend = document.getElementById("weekend").value === "yes";

    let examPeriod = document.getElementById("exam").value === "yes";


    // Prevent invalid depth

    if (depth > height) {

        depth = height;

        document.getElementById("depth").value = height;

    }

    // -----------------------------
    // Physics Formula
    // V = πr²h
    // -----------------------------

    let totalCapacity = Math.PI * radius * radius * height * 1000;

    let currentWater = Math.PI * radius * radius * depth * 1000;

    // -----------------------------
    // Mathematics
    // -----------------------------

    let waterPerPerson = 135;

    let dailyDemand = people * waterPerPerson;

    let temperatureFactor = 1;
    if (temperature > 25) {
        temperatureFactor += (temperature - 25) * 0.02;
    }

    let weekendFactor = weekend ? 1.15 : 1;

    let examFactor = examPeriod ? 1.12 : 1;

    let demandMultiplier = temperatureFactor * weekendFactor * examFactor;

    let adjustedDemand = dailyDemand * demandMultiplier;

    let hourlyUsage = adjustedDemand / peakHours;

    let hoursRemaining = currentWater / hourlyUsage;

    // -----------------------------
    // Water Percentage
    // -----------------------------

    let percentage = (currentWater / totalCapacity) * 100;

    // -----------------------------
    // Display Results
    // -----------------------------

    document.getElementById("capacity").innerHTML =
        totalCapacity.toFixed(0) + " L";

    document.getElementById("current").innerHTML =
        currentWater.toFixed(0) + " L";

    document.getElementById("demand").innerHTML =
        dailyDemand.toFixed(0) + " L";

    document.getElementById("adjusted").innerHTML =
        adjustedDemand.toFixed(0) + " L";

    document.getElementById("remaining").innerHTML =
        hoursRemaining.toFixed(1) + " hrs";

    updateChart(totalCapacity, currentWater, dailyDemand, adjustedDemand);

    // -----------------------------
    // Console Information
    // -----------------------------

    console.log("========== WATER REPORT ==========");

    console.log("Residents :", people);

    console.log("Tank Capacity :", totalCapacity.toFixed(0), "L");

    console.log("Current Water :", currentWater.toFixed(0), "L");

    console.log("Daily Demand :", dailyDemand.toFixed(0), "L");
    console.log("Temperature Factor :", temperatureFactor.toFixed(2));
    console.log("Weekend Factor :", weekendFactor.toFixed(2));
    console.log("Exam Factor :", examFactor.toFixed(2));
    console.log("Adjusted Demand :", adjustedDemand.toFixed(0), "L");
    console.log("Hours Remaining :", hoursRemaining.toFixed(1));
    console.log("Water Level :", percentage.toFixed(1), "%");

    // -----------------------------
    // Alerts
    // -----------------------------

    if (percentage < 20) {

        alert("⚠ Warning!\nWater level is below 20%.");

    }

    else if (dailyDemand > totalCapacity) {

        alert("⚠ Daily demand exceeds tank capacity.");

    }

}

function setupChart() {
    const ctx = document.getElementById('usageChart').getContext('2d');
    resultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Capacity', 'Current', 'Demand', 'Adjusted'],
            datasets: [{
                label: 'Liters',
                data: [0, 0, 0, 0],
                backgroundColor: [
                    'rgba(0, 180, 216, 0.7)',
                    'rgba(144, 224, 239, 0.7)',
                    'rgba(255, 195, 0, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: [
                    'rgba(0, 180, 216, 1)',
                    'rgba(144, 224, 239, 1)',
                    'rgba(255, 195, 0, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.12)'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
}

function updateChart(capacity, current, demand, adjusted) {
    if (!resultsChart) return;
    resultsChart.data.datasets[0].data = [
        capacity.toFixed(0),
        current.toFixed(0),
        demand.toFixed(0),
        adjusted.toFixed(0)
    ];
    resultsChart.update();
}
