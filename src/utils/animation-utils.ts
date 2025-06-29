/**
 * Animation utility functions for enhanced UI/UX
 */

// Add shine effect to elements when they come into view
export const addShineEffectOnScroll = () => {
  // Use Intersection Observer API
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Add shine effect when element enters viewport
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        
        // Remove shine effect after animation completes
        setTimeout(() => {
          entry.target.classList.remove('reveal');
        }, 1000);
      }
    });
  }, { threshold: 0.2 });
  
  // Observe all elements with shine-effect class
  document.querySelectorAll('.shine-effect').forEach(element => {
    observer.observe(element);
  });
  
  return observer;
};

// Apply floating animation with different delays
export const applyFloatingAnimation = () => {
  document.querySelectorAll('.float-item').forEach((element, index) => {
    // Stagger animation delays
    const delay = index * 0.2;
    (element as HTMLElement).style.animationDelay = `${delay}s`;
  });
};

// Create parallax scrolling effect
export const initParallaxEffect = () => {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach(element => {
      const speed = Number((element as HTMLElement).dataset.speed || 0.2);
      const offset = scrollY * speed;
      (element as HTMLElement).style.transform = `translateY(${offset}px)`;
    });
  });
};

// Add interactive tilt effect to cards
export const addTiltEffect = (selector: string, perspective: number = 1000) => {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    element.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = (element as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const tiltX = (centerX - x) / centerX * 5;
      const tiltY = (y - centerY) / centerY * 5;
      
      (element as HTMLElement).style.transform = 
        `perspective(${perspective}px) rotateX(${tiltY}deg) rotateY(${-tiltX}deg)`;
    });
    
    element.addEventListener('mouseleave', () => {
      (element as HTMLElement).style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
};
