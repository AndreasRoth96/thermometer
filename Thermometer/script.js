$(document).ready(function () {
    // Initiale Datenladung nach dem Einfügen der SVG
    loadCSVData();

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
        const maxPercentage = 100;
        const adjustedPercentage = Math.min(percentage, maxPercentage); // Begrenze den Prozentsatz auf 100%

        const pathLength = 300; // Länge des Füllpfads in der SVG
        const fillHeight = (adjustedPercentage / 100) * pathLength; // Höhe der roten Füllung berechnen
        const yPosition = 320 - fillHeight; // Y-Position der Füllung berechnen

        $('#thermo-fill').attr('height', fillHeight);
        $('#thermo-fill').attr('y', yPosition);

        // Aktuellen Betrag im Kreis aktualisieren
        $('#current-amount').text(`${amount} €`);
        $('#current-amount').attr('y', 355); // Setze die Y-Position in die Mitte des Kreises
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
            1: 240,
            2: 180,
            3: 120,
            4: 60,
            5: 20
        };// Y-Positionen der Markierungen

        for (let i = 1; i <= steps; i++) {
            const value = (i * stepValue).toFixed(0);
            const position = stepPositions[i];
            incrementsContainer.append(`<div class="increment-label" style="top: ${position}px; left: 0;">${value}€</div>`);
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
    }).on('mouseout', '#thermometer-svg', function () {
        $('#tooltip').hide();
    });

    // Periodische Aktualisierung der CSV-Daten alle 30 Sekunden
    setInterval(loadCSVData, 30000);
});
