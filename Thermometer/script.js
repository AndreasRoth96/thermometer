$(document).ready(function () {
    // CSV-Datei einlesen
    function loadCSVData(){
    $.ajax({
        url: 'daten.csv',
        type: 'GET',
        cache: false,
        success: function(data){

        console.log("CSV-Daten geladen: ");
        console.log(data);

        const parsedData = parseCSV(data);
        const totalGoal = parsedData.totalGoal;
        const currentAmount = parsedData.currentAmount;
        
        console.log("Geparste Daten:");
        console.log("Total Goal: " + totalGoal);
        console.log("Current Amount: " + currentAmount);


        updateThermometer(totalGoal, currentAmount);
        updateAmountDisplay(totalGoal, currentAmount);
        },
    error: function() {
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
            if(goal && amount){
            totalGoal += parseFloat(goal);
            currentAmount += parseFloat(amount);
        }
        });

        return { totalGoal, currentAmount };
    }

    function updateThermometer(goal, amount) {
        const percentage = (amount / goal) * 100;
        const fillHeight = (percentage / 100) * 200; // Höhe der Füllung berechnen (max 200)
        const yPosition = 220 - fillHeight; // Y-Position der Füllung berechnen

        // Füllung des Thermometers aktualisieren
        $('#thermo-fill').attr('height', fillHeight);
        $('#thermo-fill').attr('y', yPosition);
        
    }
    function updateAmountDisplay(goal, amount) {
        const percentage = ((amount / goal) * 100).toFixed(2);
        $('#amount-display').text(`Gespendet: ${amount} / ${goal} (${percentage}%)`);
    }

    $('#thermometer-svg').mousemove(function (e){
        const tooltip = $('#tooltip');
        const totalGoal = $('#amount-display').text().split('/')[1].split('(')[0].trim();
        const currentAmount = $('#amount-display').text().split(':')[1].split('/')[0].trim();
        const percentage = ((currentAmount / totalGoal) * 100).toFixed(2);

        tooltip.text(`Gespendet: ${currentAmount} / ${totalGoal} (${percentage}%)`);
        tooltip.css('left', e.pageX + 10 + 'px');
        tooltip.css('top', e.pageY + 10 + 'px');
        tooltip.show();
    }).mouseout(function () {
        $('#tooltip').hide();
    });
    setInterval(loadCSVData, 30000);
    loadCSVData();
});
