$(document).ready(function () {
    // SVG-Datei einlesen und in den Container einfügen
    $('#svg-container').load('thermometer.svg', function() {
        // Initiale Datenladung nach dem Einfügen der SVG
        loadCSVData();
    });

    // Funktion zur Aktualisierung der CSV-Daten
    function loadCSVData() {
        $.ajax({
            url: 'daten.csv',
            type: 'GET',
            cache: false,
            success: function (data) {
                console.log("CSV-Daten geladen:");
                console.log(data); // Debugging-Ausgabe

                const parsedData = parseCSV(data);
                const totalGoal = parsedData.totalGoal;
                const currentAmount = parsedData.currentAmount;

                console.log("Geparste Daten:");
                console.log("Total Goal: " + totalGoal);
                console.log("Current Amount: " + currentAmount);

                updateThermometer(totalGoal, currentAmount);
                updateAmountDisplay(totalGoal, currentAmount);
                updateGoalValue(totalGoal);
                updateIncrements(totalGoal);
            },
            error: function () {
                console.error("Fehler beim Laden der CSV-Datei.");
            }
        });
    }

    function parseCSV(data) {
        const lines = data.split('\n');
        let totalGoal = 0;
        let currentAmount = 0;

        lines.forEach(line => {
            const [goal, amount] = line.split(';');
            if (goal && amount) {
                totalGoal += parseFloat(goal);
                currentAmount += parseFloat(amount);
            }
        });

        return { totalGoal, currentAmount };
    }

    function updateThermometer(goal, amount) {
        const percentage = (amount / goal) * 100;
        const pathLength = 200; // Länge des Füllpfads in der SVG

        // Höhe der roten Füllung berechnen
        const fillHeight = (percentage / 100) * pathLength;
        const yPosition = 220 - fillHeight; // Y-Position der Füllung berechnen

        // Füllung des Thermometers aktualisieren
        $('#thermo-fill').attr({ height: fillHeight, y: yPosition });

        // Aktuellen Betrag im Kreis aktualisieren
        $('#current-amount').text(`${amount} €`);
    }

    function updateAmountDisplay(goal, amount) {
        const percentage = ((amount / goal) * 100).toFixed(2);
        $('#amount-display').text(`Gespendet: ${amount} / ${goal} (${percentage}%)`);
    }

    function updateGoalValue(goal) {
        $('#goal-value').text(`${goal}€`);
    }

    function updateIncrements(goal) {
        const ticksGroup = $('#thermometer-svg').find('#ticks');
        ticksGroup.empty();
        const steps = 5;
        const height = 200;  // Gesamthöhe der Skala
        for (let i = 0; i <= steps; i++) {
            const value = (i * goal / steps).toFixed(0);
            const y = 220 - (i * height / steps);
            // Linie
            ticksGroup.append(`<line x1="55" y1="${y}" x2="75" y2="${y}" stroke="#666" stroke-width="1"/>`);
            // Text
            ticksGroup.append(`<text x="80" y="${y + 3}" font-size="10" fill="#666">${value}€</text>`);
        }
    }


    // Tooltip hinzufügen und bei Mausbewegung aktualisieren
    $('#thermometer-container').on('mousemove', '#thermometer-svg', function (e) {
        const tooltip = $('#tooltip');
        const totalGoal = $('#amount-display').text().split('/')[1].split('(')[0].trim();
        const currentAmount = $('#amount-display').text().split(':')[1].split('/')[0].trim();
        const percentage = ((currentAmount / totalGoal) * 100).toFixed(2);

        tooltip.text(`Gespendet: ${currentAmount} / ${totalGoal} (${percentage}%)`);
        tooltip.css('left', e.pageX + 10 + 'px');
        tooltip.css('top', e.pageY + 10 + 'px');
        tooltip.show();
    }).on('mouseout', '#korbschlaeger-svg', function () {
        $('#tooltip').hide();
    });

    // Periodische Aktualisierung der CSV-Daten alle 30 Sekunden
    setInterval(loadCSVData, 30000);
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('.topbar');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.topbar');

    function checkScroll() {
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Beim Scrollen auslösen
    window.addEventListener('scroll', checkScroll);
    // Einmal beim Laden, falls der Benutzer schon weiter unten ist
    checkScroll();
});
