/**
 * Havenya Landing Page - Main JavaScript
 * Handles navigation, animations, tabs, testimonials, FAQ, and forms
 */

(function() {
  'use strict';

  // ========================================
  // DOM Ready
  // ========================================
  document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initSmoothScroll();
    initAnimations();
    initShopleezTabs();
    initTestimonials();
    initFAQ();
    initForms();
  });

  // ========================================
  // Navigation
  // ========================================
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-menu');

    if (!navbar) return;

    // Scroll behavior - add shadow and reduce padding
    let lastScrollY = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // Mobile menu toggle
    if (toggle && menu) {
      toggle.addEventListener('click', function() {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        toggle.classList.toggle('active');
        menu.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
      });

      // Close menu when clicking a link
      menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          toggle.classList.remove('active');
          menu.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      // Close menu on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
          toggle.classList.remove('active');
          menu.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }
  }

  // ========================================
  // Smooth Scroll
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const target = document.querySelector(targetId);

        if (target) {
          e.preventDefault();

          const navbarHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ========================================
  // Scroll Animations
  // ========================================
  function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (!animatedElements.length) return;

    // Check if element is in viewport
    function isInViewport(element, threshold = 0.1) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      return (
        rect.top <= windowHeight * (1 - threshold) &&
        rect.bottom >= windowHeight * threshold
      );
    }

    // Animate elements in viewport
    function checkAnimations() {
      animatedElements.forEach(function(element) {
        if (isInViewport(element) && !element.classList.contains('animated')) {
          element.classList.add('animated', 'animate-fade-in-up');
        }
      });
    }

    // Use Intersection Observer if available
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated', 'animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      animatedElements.forEach(function(element) {
        observer.observe(element);
      });
    } else {
      // Fallback for older browsers
      window.addEventListener('scroll', checkAnimations, { passive: true });
      checkAnimations(); // Initial check
    }
  }

  // ========================================
  // Shopleez Tabs
  // ========================================
  function initShopleezTabs() {
    const tabs = document.querySelectorAll('.shopleez-tab');
    const contents = document.querySelectorAll('.shopleez-content');

    if (!tabs.length) return;

    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        const targetId = this.getAttribute('data-tab');

        // Update tabs
        tabs.forEach(function(t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        // Update content
        contents.forEach(function(content) {
          content.classList.remove('active');
        });

        const targetContent = document.getElementById(targetId + '-panel');
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });

      // Keyboard navigation
      tab.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          const tabArray = Array.from(tabs);
          const currentIndex = tabArray.indexOf(this);
          let newIndex;

          if (e.key === 'ArrowLeft') {
            newIndex = currentIndex === 0 ? tabArray.length - 1 : currentIndex - 1;
          } else {
            newIndex = currentIndex === tabArray.length - 1 ? 0 : currentIndex + 1;
          }

          tabArray[newIndex].focus();
          tabArray[newIndex].click();
        }
      });
    });
  }

  // ========================================
  // Testimonials Carousel
  // ========================================
  function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dot');

    if (!testimonials.length) return;

    let currentIndex = 0;
    let autoplayInterval;

    function showTestimonial(index) {
      testimonials.forEach(function(t, i) {
        t.classList.toggle('active', i === index);
      });

      dots.forEach(function(d, i) {
        d.classList.toggle('active', i === index);
        d.setAttribute('aria-selected', i === index);
      });

      currentIndex = index;
    }

    function nextTestimonial() {
      const next = (currentIndex + 1) % testimonials.length;
      showTestimonial(next);
    }

    // Dot click handlers
    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        showTestimonial(index);
        resetAutoplay();
      });
    });

    // Autoplay
    function startAutoplay() {
      autoplayInterval = setInterval(nextTestimonial, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    // Start autoplay
    startAutoplay();

    // Pause on hover
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
      slider.addEventListener('mouseenter', function() {
        clearInterval(autoplayInterval);
      });

      slider.addEventListener('mouseleave', function() {
        startAutoplay();
      });
    }
  }

  // ========================================
  // FAQ Accordion
  // ========================================
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (!faqItems.length) return;

    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      question.addEventListener('click', function() {
        const isOpen = item.classList.contains('active');

        // Close all other items (optional - remove for multiple open items)
        faqItems.forEach(function(otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        item.classList.toggle('active');
        question.setAttribute('aria-expanded', !isOpen);
      });

      // Keyboard support
      question.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }

  // ========================================
  // Form Handling
  // ========================================
  function initForms() {
    // Contact form
    const contactForm = document.getElementById('contact-form-element');
    if (contactForm) {
      initFormValidation(contactForm, 'form-success');
    }

    // Deletion form
    const deletionForm = document.getElementById('deletion-form');
    if (deletionForm) {
      initFormValidation(deletionForm, 'deletion-success');
    }
  }

  function initFormValidation(form, successId) {
    const successMessage = document.getElementById(successId);

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Reset previous errors
      form.querySelectorAll('.form-group').forEach(function(group) {
        group.classList.remove('error');
      });

      // Validate
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(function(field) {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Submit form via Formspree or similar service
        submitForm(form, successMessage);
      }
    });

    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(function(field) {
      field.addEventListener('blur', function() {
        if (field.hasAttribute('required')) {
          validateField(field);
        }
      });

      field.addEventListener('input', function() {
        const group = field.closest('.form-group');
        if (group && group.classList.contains('error')) {
          validateField(field);
        }
      });
    });
  }

  function validateField(field) {
    const group = field.closest('.form-group');
    let isValid = true;

    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
    }

    if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
      }
    }

    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
      isValid = false;
    }

    if (group) {
      group.classList.toggle('error', !isValid);
    }

    return isValid;
  }

  function submitForm(form, successMessage) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Sending...</span>';

    // Prepare form data
    const formData = new FormData(form);

    // Send to Formspree (or similar service)
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(function(response) {
      if (response.ok) {
        // Show success message
        form.style.display = 'none';
        if (successMessage) {
          successMessage.classList.add('show');
        }

        // Reset form
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(function(error) {
      console.error('Error:', error);
      alert('There was an error submitting your form. Please try again or contact us directly at ahmed@havenya.com');
    })
    .finally(function() {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    });
  }

  // ========================================
  // Utility Functions
  // ========================================

  // Debounce function for performance
  function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;

      const later = function() {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for scroll events
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;

      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() {
          inThrottle = false;
        }, limit);
      }
    };
  }

})();
