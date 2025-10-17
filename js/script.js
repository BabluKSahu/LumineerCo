
    const bookServiceHeaderBtn = document.getElementById('bookServiceHeaderBtn');
    const bookServiceHeroBtn = document.getElementById('bookServiceHeroBtn');
    const ctaBookServiceBtn = document.getElementById('ctaBookServiceBtn');
    const becomeProviderFooterBtn = document.getElementById('becomeProviderFooterBtn');
    const bookServiceModal = document.getElementById('bookServiceModal');
    const becomeProviderModal = document.getElementById('becomeProviderModal');
    const closeBookServiceModal = document.getElementById('closeBookServiceModal');
    const closeBecomeProviderModal = document.getElementById('closeBecomeProviderModal');
    const closeBookServiceModalBtn = document.getElementById('closeBookServiceModalBtn');
    const closeBecomeProviderModalBtn = document.getElementById('closeBecomeProviderModalBtn');
    const continueToFormBtn = document.getElementById('continueToFormBtn');
    const continueToProviderFormBtn = document.getElementById('continueToProviderFormBtn');
    const selectedServiceName = document.getElementById('selectedServiceName');
    const bookServiceButtons = document.querySelectorAll('.book-service-btn');
    const serviceLinks = document.querySelectorAll('.service-link');
    const servicesScroll = document.getElementById('servicesScroll');
    const scrollLeft = document.getElementById('scrollLeft');
    const scrollRight = document.getElementById('scrollRight');

    function openBookServiceModal(serviceName = '') {
      if (serviceName) {
        selectedServiceName.textContent = serviceName;
        // Update the form URL with service type if needed
        // continueToFormBtn.href = `https://docs.google.com/forms/d/e/1FAIpQLSdl3tyiAFA7goNJ8LpCLkmK4x1M7Im2_yHiAWMB-Q0mwZ0kTQ/viewform?entry.123456789=${encodeURIComponent(serviceName)}`;
      }
      bookServiceModal.style.display = 'flex';
    }
    bookServiceHeaderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookServiceModal();
    });
    bookServiceHeroBtn.addEventListener('click', () => {
      openBookServiceModal();
    });
    ctaBookServiceBtn.addEventListener('click', () => {
      openBookServiceModal();
    });
    bookServiceButtons.forEach(button => {
      button.addEventListener('click', () => {
        const serviceName = button.getAttribute('data-service');
        openBookServiceModal(serviceName);
      });
    });
    serviceLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceName = link.getAttribute('data-service');
        openBookServiceModal(serviceName);
        // Scroll to services section
        document.getElementById('services').scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
    becomeProviderFooterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      becomeProviderModal.style.display = 'flex';
    });

    function closeBookServiceModalFunc() {
      bookServiceModal.style.display = 'none';
    }

    function closeBecomeProviderModalFunc() {
      becomeProviderModal.style.display = 'none';
    }
    closeBookServiceModal.addEventListener('click', closeBookServiceModalFunc);
    closeBecomeProviderModal.addEventListener('click', closeBecomeProviderModalFunc);
    closeBookServiceModalBtn.addEventListener('click', closeBookServiceModalFunc);
    closeBecomeProviderModalBtn.addEventListener('click', closeBecomeProviderModalFunc);
    window.addEventListener('click', (e) => {
      if (e.target === bookServiceModal) {
        closeBookServiceModalFunc();
      }
      if (e.target === becomeProviderModal) {
        closeBecomeProviderModalFunc();
      }
    });
    scrollLeft.addEventListener('click', () => {
      servicesScroll.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    });
    scrollRight.addEventListener('click', () => {
      servicesScroll.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    });
    let autoScrollInterval;

    function startAutoScroll() {
      autoScrollInterval = setInterval(() => {
        servicesScroll.scrollBy({
          left: 300,
          behavior: 'smooth'
        });
        if (servicesScroll.scrollLeft + servicesScroll.clientWidth >= servicesScroll.scrollWidth - 10) {
          setTimeout(() => {
            servicesScroll.scrollTo({
              left: 0,
              behavior: 'smooth'
            });
          }, 1000);
        }
      }, 4000);
    }

    function stopAutoScroll() {
      clearInterval(autoScrollInterval);
    }
    window.addEventListener('load', startAutoScroll);
    servicesScroll.addEventListener('mouseenter', stopAutoScroll);
    servicesScroll.addEventListener('mouseleave', startAutoScroll);
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
    const termsLink = document.getElementById('termsLink');
    const termsModal = document.getElementById('termsModal');
    const closeTermsModal = document.getElementById('closeTermsModal');
    const acceptTermsBtn = document.getElementById('acceptTermsBtn');
    const termsTabs = document.querySelectorAll('.terms-tab');
    const termsTabContents = document.querySelectorAll('.terms-tab-content');
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      termsModal.style.display = 'flex';
    });
    closeTermsModal.addEventListener('click', () => {
      termsModal.style.display = 'none';
    });
    acceptTermsBtn.addEventListener('click', () => {
      termsModal.style.display = 'none';
      localStorage.setItem('termsAccepted', 'true');
    });
    termsTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        termsTabs.forEach(t => t.classList.remove('active'));
        termsTabContents.forEach(content => content.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`${tabId}-terms`).classList.add('active');
      });
    });
    window.addEventListener('click', (e) => {
      if (e.target === termsModal) {
        termsModal.style.display = 'none';
      }
    });
    document.addEventListener('DOMContentLoaded', () => {
      const termsAccepted = localStorage.getItem('termsAccepted');
      if (!termsAccepted) {
        // You can automatically show terms on first visit if needed
        // termsModal.style.display = 'flex';
      }
    });
