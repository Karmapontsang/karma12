
// This function runs when the button is clicked
/*      function greetUser() {
        let name = prompt("What's your name? \n ཁྱེད་རང་གི་མིང་ལ་ག་རེ་རེད།");
        if (name) {
          alert("Tashi Delek བཀྲ་ཤིས་བདེ་ལེགས།, " + name + "! 👋");
        } else {
          alert("You didn't enter a name.");
        }
      }
      */
// Initialize the map centered near Yumbhu Lhakhang
  // Initialize the map centered between Lhoka and Lhasa
  const map = L.map('map').setView([30.5, 85], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const yumbhulhagang = [29.2333, 91.7667];
  const lhasa = [29.6578, 91.1175];
  const dharamsala = [32.2207, 76.3203]; 


  const storyPanel = document.getElementById('story-panel');

  // Marker for Yumbhu Lhakhang
  L.marker(yumbhulhagang).addTo(map)
    .bindPopup("📍 Lhokha")
    .on('click', () => {
      storyPanel.innerHTML = `
        <h2></h2>
        <p></p>
      `;
    });

  // Marker for Lhasa
  L.marker(lhasa).addTo(map)
    .bindPopup("📍 Lhasa")
    .on('click', () => {
      storyPanel.innerHTML = `
        <h2></h2>
        <p></p>
      `;
    });
    // Marker for Dharamsala
      L.marker(dharamsala).addTo(map)
        .bindPopup("📍 Dharamshala")
        .on('click', () => {
          storyPanel.innerHTML = `
            <h2></h2>
            <p></p>
          `;
        });
  const path = L.polyline([yumbhulhagang, lhasa, dharamsala], {
    color: 'red',
    weight: 4
  }).addTo(map);

  map.fitBounds(path.getBounds(), {
    paddingTopLeft: [50, 50],
    paddingBottomRight: [50, 50],
    maxZoom: 7
  });


// My image slide with captions
      const slides = document.querySelectorAll('.carousel-slide');
      let current = 0;

      document.querySelector('.next-btn').addEventListener('click', () => {
        slides[current].classList.add('hidden');
        current = (current + 1) % slides.length;
        slides[current].classList.remove('hidden');
      });

      document.querySelector('.prev-btn').addEventListener('click', () => {
        slides[current].classList.add('hidden');
        current = (current - 1 + slides.length) % slides.length;
        slides[current].classList.remove('hidden');
      });

// Three capitals story block
     const storyBlocks = document.querySelectorAll('.story-block');

    const revealOnScroll = () => {
      storyBlocks.forEach(block => {
        const top = block.getBoundingClientRect().top;
        const bottom = block.getBoundingClientRect().bottom;

        if (top < window.innerHeight * 0.85 && bottom > 0) {
          block.classList.add('revealed');
        } else {
          block.classList.remove('revealed'); // Remove on scroll out
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
