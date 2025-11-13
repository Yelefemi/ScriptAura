// run after DOM ready to avoid missing elements
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle with animation
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      menuToggle.classList.toggle('active');
    });
  }

  // Testimonials Auto Slider (if present)
  const testimonials = document.querySelectorAll('.testimonial');
  if (testimonials.length > 0) {
    let tIndex = 0;
    testimonials[tIndex].classList.add('active');
    setInterval(() => {
      testimonials[tIndex].classList.remove('active');
      tIndex = (tIndex + 1) % testimonials.length;
      testimonials[tIndex].classList.add('active');
    }, 4000);
  }

  // Scroll reveal animation for general sections
  const revealElements = document.querySelectorAll('section, footer, .divisions-preview, .impact, .testimonials, .cta-banner, .executives, .exec-card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show-section');
      }
    });
  }, { threshold: 0.2 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Executives: ensure each card reveals and social icons are ready
  const execCards = document.querySelectorAll('.exec-card');
  if (execCards.length > 0) {
    const execObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show-section');
          execObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    execCards.forEach(card => execObserver.observe(card));
  }

  // Counter animation (if impact section present)
  const impactSection = document.querySelector('.impact');
  if (impactSection) {
    const counters = impactSection.querySelectorAll('.counter');
    const speed = 200;
    function runCounter(counter) {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = Math.ceil(target / speed);
        if (count < target) {
          counter.innerText = count + increment;
          setTimeout(updateCount, 40);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.counter');
          counters.forEach(runCounter);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(impactSection);
  }
});


// Chat Assistant
const chatToggle = document.getElementById('chat-toggle');
const chatBox = document.getElementById('chat-box');
const closeChat = document.getElementById('close-chat');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBody = document.getElementById('chat-body');

if (chatToggle && chatBox && closeChat) {
  chatToggle.addEventListener('click', () => chatBox.style.display = 'flex');
  closeChat.addEventListener('click', () => chatBox.style.display = 'none');
}

if (sendBtn && userInput && chatBody) {
  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  const userMsg = document.createElement('div');
  userMsg.classList.add('chat-message', 'user');
  userMsg.textContent = text;
  chatBody.appendChild(userMsg);
  userInput.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  // Mock AI reply
  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.classList.add('chat-message', 'bot');
    botMsg.textContent = getBotReply(text);
    chatBody.appendChild(botMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 1000);
}

function getBotReply(input) {
  input = input.toLowerCase();
  if (input.includes('hello') || input.includes('hi')) return 'Hello 👋! How can I assist you today?';
  if (input.includes('contact') || input.includes('email')) return 'You can reach us at info@scriptaurastudios.com 📧';
  if (input.includes('project') || input.includes('collaborate')) return 'We’d love to collaborate! Tell me a bit about your idea.';
  return 'I’m still learning 🤖 — but our team will get back to you soon!';
}
