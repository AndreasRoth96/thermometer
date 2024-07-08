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
        $('#thermo-fill').attr('height', fillHeight);
        $('#thermo-fill').attr('y', yPosition);

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
        const incrementsContainer = $('#increments');
        incrementsContainer.empty();

        // Anzahl der Schritte
        const steps = 5;
        const stepValue = goal / steps;

        // Angepasste Y-Positionen der Markierungen
        const stepPositions = {
            0: 360,
            1: 267,
            2: 215,
            3: 160,
            4: 107,
            5: 54
        };

        for (let i = steps; i >= 0; i--) {
            const value = (i * stepValue).toFixed(0);
            const position = stepPositions[i];
            incrementsContainer.append(`<div class="increment-label" style="top: ${position}px;">${value}€</div>`);
        }
    }

    // Tooltip hinzufügen und bei Mausbewegung aktualisieren
    $('#thermometer-container').on('mousemove', '#korbschlaeger-svg', function (e) {
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
