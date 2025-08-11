let eventsData = {};

// Load JSON on page load
window.addEventListener('DOMContentLoaded', () => {
  fetch('data/events.json')
    .then(res => res.json())
    .then(data => {
      eventsData = data;

      // ✅ 1) Set default input to July 2025
      const input = document.getElementById('searchMonth');
      input.value = '2025-07';

      // ✅ 2) Render July 2025 by default
      renderEvents('2025', 'July');
    })
    .catch(err => console.error('Error loading JSON:', err));
});

// Render event cards + calendar
function renderEvents(year, month) {
  const container = document.getElementById('eventsContainer');
  container.innerHTML = '';

  let eventsToShow = [];
  if (year && month) {
    if (eventsData[year] && eventsData[year][month]) {
      eventsToShow = eventsData[year][month];
    }
  } else {
    for (const y in eventsData) {
      for (const m in eventsData[y]) {
        eventsToShow = eventsToShow.concat(eventsData[y][m]);
      }
    }
  }

  if (eventsToShow.length === 0) {
    container.innerHTML = '<p>No events found for this period.</p>';
    renderCalendar(year, month, []);
    return;
  }

  eventsToShow.forEach(event => {
    const card = document.createElement('div');
    card.className = 'event-card';

    const img = document.createElement('img');
    img.src = `images/${event.img}`;
    img.alt = event.title;

    const details = document.createElement('div');
    details.className = 'details';

    const title = document.createElement('h3');
    title.textContent = event.title;

    const date = document.createElement('p');
    date.textContent = `Date: ${new Date(event.dateUTC).toLocaleString()}`;

    const desc = document.createElement('p');
    desc.textContent = event.description;

    details.appendChild(title);
    details.appendChild(date);
    details.appendChild(desc);

    card.appendChild(img);
    card.appendChild(details);

    container.appendChild(card);
  });

  renderCalendar(year, month, eventsToShow);
}

// Search handler
function searchEvents() {
  const input = document.getElementById('searchMonth').value;
  if (!input) {
    renderEvents();
    return;
  }

  const [year, monthNum] = input.split('-');
  const monthName = new Date(`${year}-${monthNum}-01`).toLocaleString('default', { month: 'long' });

  renderEvents(year, monthName);
}

// Generate calendar grid
function renderCalendar(year, month, events) {
  const section = document.getElementById('calendarSection');
  if (!year || !month) {
    section.innerHTML = '';
    return;
  }

  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Extract event days
  const eventDays = {};
  events.forEach(e => {
    const d = new Date(e.dateUTC);
    if (d.getFullYear() == year && d.toLocaleString('default', { month: 'long' }) === month) {
      eventDays[d.getDate()] = e.title;
    }
  });

  let html = `<h2>📅 ${month} ${year}</h2><div class="calendar-grid">`;
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(d => {
    html += `<div class="day-header">${d}</div>`;
  });

  for (let i = 0; i < firstDay; i++) html += `<div></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    if (eventDays[d]) {
      html += `<div class="day event" data-tooltip="${eventDays[d]}">${d}</div>`;
    } else {
      html += `<div class="day">${d}</div>`;
    }
  }

  html += `</div>`;
  section.innerHTML = html;
}
