/**
 * @param {*} target The element we want to spawn the particles around
 * @param {*} options The options object, with a number property to specify the number of particles to spawn
 */
function createEmojiParticles(target, options = { number: 10 }) {
  const emojis = ["🎉", "🌟", "💫", "✨", "🔥", "🚀"];

  const targetRect = target.getBoundingClientRect();
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;

  for (let i = 0; i < options.number; i++) {
    const emoji = document.createElement("span");
    emoji.classList.add("emoji-particle");
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const randomAngle = Math.random() * Math.PI * 2;
    const randomDistance = Math.random() * 30 + 20;
    const offsetX = Math.cos(randomAngle) * randomDistance;
    const offsetY = Math.sin(randomAngle) * randomDistance;
    const particleX = targetCenterX + offsetX;
    const particleY = targetCenterY + offsetY;

    emoji.style.left = particleX + "px";
    emoji.style.top = particleY + "px";
    emoji.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    document.body.appendChild(emoji);

    requestAnimationFrame(() => {
      emoji.style.opacity = "0";
      emoji.style.transform = `translate(${offsetX * 3}px, ${offsetY * 3}px)`;
    });

    setTimeout(() => {
      emoji.remove();
    }, 600);
  }
}

/**
 * @param {HTMLElement[]} toShake
 * @returns
 * @description Shakes the elements passed in the array
 */

function shakeElements(toShake) {
  (toShake ?? []).forEach((element) => {
    element.classList.add("shake-animation");
    setTimeout(() => {
      element.classList.remove("shake-animation");
    }, 300);
  });
  const elementsToShake = document.querySelectorAll(".shake-element");
  elementsToShake.forEach((element) => {
    element.classList.add("shake-animation");
    setTimeout(() => {
      element.classList.remove("shake-animation");
    }, 300);
  });
}

/**
 * @description Adds a flash animation to the body element to indicate a reset with a negative filter applied
 */
function animateReset() {
  document.body.classList.add("flash-animation");

  setTimeout(() => {
    document.body.classList.remove("flash-animation");
  }, 230);
}