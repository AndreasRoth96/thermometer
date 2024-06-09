$(document).ready(function () {
    // SVG-Datei einlesen und in den Container einfügen
    $('#svg-container').load('korbschlaeger.svg', function() {
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
        const pathLength = 290; // Länge des Pfads in der SVG

        // Länge der roten Füllung berechnen
        const fillLength = (percentage / 100) * pathLength;

        // Füllung des Korbschlägers aktualisieren
        $('#fill').attr('stroke-dasharray', `${fillLength},${pathLength - fillLength}`);
    }

    function updateAmountDisplay(goal, amount) {
        const percentage = ((amount / goal) * 100).toFixed(2);
        $('#amount-display').text(`Gespendet: ${amount} / ${goal} (${percentage}%)`);
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
