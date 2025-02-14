let openedCards = 0; // Track opened cards
let currentAudio = null; // Track the currently playing audio

document.addEventListener('DOMContentLoaded', () => {
    const surpriseOverlays = document.querySelectorAll('.surprise-overlay');
    const buttons = document.querySelectorAll('.surprise-btn');
    // Function to update the lock state for an individual button based on its data-unlock attribute.
    function updateLockStateForButton(button) {
        const unlockTimeStr = button.getAttribute('data-unlock');
        if (!unlockTimeStr) return; // If no unlock time is set, do nothing.
        const unlockTime = new Date(unlockTimeStr);
        const now = new Date();
        if (now < unlockTime) {
            button.disabled = true;
            button.textContent = '🔒';// Update this 🔒 icon with your own text or icon
            button.style.fontSize = '2rem';
            button.classList.add('opacity-60', 'cursor-not-allowed');
        } else {
            button.disabled = false;
            button.textContent = 'Show Surprise';
            button.style.fontSize = '';
            button.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    // Function to update the lock state for all buttons.
    function updateLockStates() {
        buttons.forEach(button => updateLockStateForButton(button));
    }

    // Run the check immediately and then every second.
    updateLockStates();
    setInterval(updateLockStates, 1000);

    // Show full-screen surprise and toggle audio
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const surpriseId = button.getAttribute('data-surprise');
            const surpriseElement = document.getElementById(`surprise-${surpriseId}`);
            const audioElement = document.getElementById(`audio-${surpriseId}`);

            // Stop any currently playing audio
            if (currentAudio && currentAudio !== audioElement) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            // Show the surprise overlay
            surpriseElement.style.display = 'flex';

            // Update current audio
            currentAudio = audioElement;

            // Toggle audio playback
            currentAudio.play();

            // Mark card as opened
            button.disabled = true;
            // Now that each card container has the "card" class, closest() works correctly.
            button.closest('.card').classList.add('bg-gray-400');
            button.style.display = 'none';
            openedCards++;

            // Disable all buttons if all cards are opened
            if (openedCards === buttons.length) {
                buttons.forEach(btn => (btn.disabled = true));
            }

            // Trigger celebration effect
            triggerCelebration();
        });
    });

    // Close surprise overlay and stop audio
    surpriseOverlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            // Hide the overlay
            overlay.style.display = 'none';

            // Stop the audio
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
        });
    });

    // Celebration effect with falling flowers
    function triggerCelebration() {
        const celebrationContainer = document.createElement('div');
        celebrationContainer.classList.add('celebration');
        document.body.appendChild(celebrationContainer);
        // Create 100 flowers or the number of flowers you want to fall.
        for (let i = 0; i < 100; i++) {
            const flower = document.createElement('div');
            flower.classList.add('flower');

            // Set a random horizontal position.
            flower.style.left = `${Math.random() * 100}vw`;

            // Set a fixed top position so that all flowers start falling from just above the viewport.
            flower.style.top = '-40px'; // Adjust this value if your flower image height is different.

            // Set a random final Y value for the fall. This makes the flower "land" somewhere near the bottom.
            // Here, final Y is set between 80vh and 90vh.
            const finalY = Math.random() * 10 + 80;
            flower.style.setProperty('--finalY', `${finalY}vh`);

            // Set a random duration for the falling animation (for a slight variation).
            // Here we choose a duration between 2 and 3 seconds so that the fall appears smooth.
            const duration = Math.random() * 2 + 3;
            flower.style.animation = `fall ${duration}s linear forwards`;

            celebrationContainer.appendChild(flower);
        }

        // Keep the celebration container visible for 10 seconds (so the flowers "collect" at the bottom).
        setTimeout(() => {
            celebrationContainer.remove();
        }, 7000); // 10,000 milliseconds = 10 seconds
    }
});