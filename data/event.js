document.addEventListener('DOMContentLoaded', () => {
  const events = [
    {
      title: "Perseverance Rover Lands on Mars",
      date: "2021-02-18",
      description: "NASA's most advanced rover touched down on Mars to search for signs of ancient life.",
      image: "perseverance.jpg"
    },
    {
      title: "James Webb Space Telescope Launch",
      date: "2021-12-25",
      description: "Launched to study the early universe, stars, and exoplanets.",
      image: "jwst.jpg"
    },
    {
      title: "Crew-1 Mission (SpaceX)",
      date: "2020-11-16",
      description: "First operational crewed flight to the ISS via a commercial spacecraft.",
      image: "crew1.jpg"
    },
    {
      title: "Chandrayaan-3 Moon Landing",
      date: "2023-08-23",
      description: "India lands near the lunar south pole, becoming the 4th nation to soft-land on the Moon.",
      image: "chandrayaan3.jpg"
    },
    {
      title: "Total Lunar Eclipse",
      date: "2022-11-08",
      description: "A full lunar eclipse visible across North America and Asia.",
      image: "lunar2022.jpg"
    },
    {
      title: "Hybrid Solar Eclipse",
      date: "2023-04-20",
      description: "A rare hybrid eclipse seen in parts of Australia, Indonesia, and the Pacific.",
      image: "eclipse2023.jpg"
    },
    {
      title: "Total Solar Eclipse in North America",
      date: "2024-04-08",
      description: "A total eclipse crossing Mexico, the US, and Canada.",
      image: "eclipse2024.jpg"
    },
    {
      title: "Europa Clipper Launch (Expected)",
      date: "2024-10-10",
      description: "NASA's mission to explore Jupiter’s icy moon Europa.",
      image: "europa.jpg"
    }
  ];

  const eventsGrid = document.getElementById('eventsGrid');

  events.forEach(event => {
    const card = document.createElement('div');
    card.classList.add('event-card');
    card.innerHTML = `
      <img src="images/${event.image}" alt="${event.title}">
      <div class="details">
        <h3>${event.title}</h3>
        <div class="date">${event.date}</div>
        <p>${event.description}</p>
      </div>
    `;
    eventsGrid.appendChild(card);
  });

  // Scroll animation
  const revealOnScroll = () => {
    const cards = document.querySelectorAll('.event-card');
    const triggerBottom = window.innerHeight * 0.9;

    cards.forEach(card => {
      const top = card.getBoundingClientRect().top;
      if (top < triggerBottom) card.classList.add('visible');
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);
});
