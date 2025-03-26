document.addEventListener('DOMContentLoaded', () => {
    const confettiContainer = document.getElementById('confetti-container');
  
    // Function to generate a random number between a range
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    // Function to create confetti burst
    function createConfettiBurst() {
      for (let i = 0; i < 100; i++) { // Number of confetti particles
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
  
        // Random size for each confetti particle
        const size = Math.random() * 8 + 5 + 'px';
        confetti.style.width = size;
        confetti.style.height = size;
  
        // Random color for each confetti
        const colors = ['#ff71ac', '#ffcc00', '#00ccff', '#cc00ff', '#ff3333'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  
        // Random starting position (left)
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = `${Math.random() * 50}vh`;
  
        // Random falling animation duration and delay
        confetti.style.animationDuration = `${randomInRange(2, 4)}s`;
        confetti.style.animationDelay = `${randomInRange(0, 1)}s`;
  
        // Add confetti to the container
        confettiContainer.appendChild(confetti);
  
        // Remove confetti after animation ends
        setTimeout(() => {
          confetti.remove();
        }, 5000); // Remove after 5 seconds
      }
    }
  
    // Expose function globally
    window.createConfettiBurst = createConfettiBurst;
  });
  