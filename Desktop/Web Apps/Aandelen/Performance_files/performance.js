document.addEventListener("DOMContentLoaded", function() {
  // Haal de input en de knop elementen op
  let input = document.getElementById("input");
  let punten = document.getElementById("punten");
  let button = document.getElementById("submit");
  let table = document.getElementById("logTable").getElementsByTagName('tbody')[0];

  document.getElementById('mode-toggle').addEventListener('click', function() {
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');
    const modeIcon = modeToggle.querySelector('.mode-icon');

    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
      modeIcon.src = '/assets/images/moon-stars.svg';
      modeIcon.alt = 'Switch to Dark Mode';
    } else {
      modeIcon.src = '/assets/images/sun.svg';
      modeIcon.alt = 'Switch to Light Mode';
    }
  });

  let formElements = [input, punten, button]; // Voeg hier alle form elementen toe

  // Focus automatisch op het eerste inputveld
  input.focus();

  formElements.forEach((element, index) => {
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // voorkom standaardgedrag
        if (element === button) {
          button.click(); // verstuur het formulier
        } else {
          // Ga naar het volgende element in het formulier
          if (index < formElements.length - 1) {
            formElements[index + 1].focus();
          }
        }
      }
    });
  });

  let totalRevenue = 0;
  let firstInputAdded = false; // Variabele om bij te houden of de eerste invoer is toegevoegd

  // Voeg een event listener toe aan de knop voor de klik gebeurtenis
  button.addEventListener("click", function() {
    // Haal de waarden uit de invoervelden
    let maandValue = input.value;
    let revenueValue = parseFloat(punten.value);

    if (maandValue === "" || isNaN(revenueValue)) {
      alert("🤖 Beep boop - kloppen je maand en revenue?");
      return;
    }

    // Als dit de eerste invoer is, verwijder dan de initiële data uit de grafiek
    if (!firstInputAdded) {
      resetChart(); // Reset de grafiek naar de initiële staat
      firstInputAdded = true; // Markeer dat de eerste invoer is toegevoegd
    }

    // Voeg de revenue toe aan het totaal
    totalRevenue += revenueValue;

    // Maak een nieuwe rij
    let newRow = table.insertRow();

    // Maak de maand input cel in de nieuwe rij
    let maandCell = newRow.insertCell(0);

    // Maak de revenue cel in de nieuwe rij
    let revenueCell = newRow.insertCell(1);

    // Voeg de waarde van de maand invoerveld toe aan de nieuwe cel
    let maandText = document.createTextNode(maandValue);
    maandCell.appendChild(maandText);

    // Voeg de waarde van het revenue invoerveld toe aan de nieuwe cel
    let revenueText = document.createTextNode(revenueValue);
    revenueCell.appendChild(revenueText);

    // Update de grafiek met de nieuwe gegevens
    updateChart(maandValue, revenueValue);

    // Maak de invoervelden leeg na het toevoegen van de rij
    input.value = "";
    punten.value = "";
  });

  // Functie om de grafiek te resetten naar de initiële staat
  function resetChart() {
    myChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    myChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    myChart.update();
  }

  // Functie om de grafiek te updaten
  function updateChart(maand, revenue) {
    // Voeg de nieuwe gegevens toe aan de dataset
    let index = myChart.data.labels.indexOf(maand);
    myChart.data.datasets[0].data[index] = revenue;

    // Update de grafiek
    myChart.update();
  }

  // Initiële dataset voor de grafiek
  const initialData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Omzet per maand',
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Start met allemaal nullen
      backgroundColor: [
        '#34d399',
        '#3b82f6',
        '#fb7185',
        '#fcd34d',
        '#c084fc',
        '#818cf8',
        '#5eead4',
        '#34d399',
        '#3b82f6',
        '#fb7185',
        '#fcd34d',
        '#c084fc'
      ],
      borderColor: 'transparent',
      borderRadius: 12 // Optioneel: Randradius voor de staafdiagrammen
    }]
  };

  // Configuratie voor de grafiek
  const config = {
    type: 'bar',
    data: initialData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  };

  // Maak de grafiek
  var myChart = new Chart(
    document.getElementById('myChart'),
    config
  );

    // Voeg 'selected' klasse toe aan het actieve menu-item
    const navLinks = document.querySelectorAll('.nav-links li a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Verwijder 'selected' klasse van alle links
        navLinks.forEach(navLink => navLink.classList.remove('selected'));
        // Voeg 'selected' klasse toe aan de geklikte link
        link.classList.add('selected');
      });
    });

  // Maak het logo klikbaar en stuur naar index1.html
  const logo = document.querySelector('.logo');
  logo.addEventListener('click', function() {
    window.location.href = 'index1.html';
  });
});
