/**
 * ÉCLAT PROPRETÉ — SCRIPT.JS
 * Fonctionnalités Vanilla JavaScript :
 * 1. Ouverture/fermeture accessible du menu mobile (ARIA + touche Échap)
 * 2. Filtrage interactif des cartes de prestations et présélection du devis
 * 3. Accordéon FAQ accessible au clavier
 * 4. Validation client complète du formulaire de devis et confirmation démo locale
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ========================================================================
     1. MENU MOBILE (Ouverture, fermeture, accessibilité clavier)
     ======================================================================== */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta a');

  function setMobileMenuState(isOpen) {
    if (!mobileMenuToggle || !mobileNavDrawer) return;
    mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'
    );
    if (isOpen) {
      mobileNavDrawer.removeAttribute('hidden');
    } else {
      mobileNavDrawer.setAttribute('hidden', '');
    }
  }

  if (mobileMenuToggle && mobileNavDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      const isCurrentlyOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      setMobileMenuState(!isCurrentlyOpen);
    });

    // Fermer le menu mobile après un clic sur un lien d'ancrage
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        setMobileMenuState(false);
      });
    });

    // Fermer avec la touche Échap
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
        setMobileMenuState(false);
        mobileMenuToggle.focus();
      }
    });
  }

  /* ========================================================================
     2. FILTRAGE DES PRESTATIONS & PRÉSÉLECTION POUR DEVIS
     ======================================================================== */
  const serviceTabs = document.querySelectorAll('.service-tab');
  const serviceCards = document.querySelectorAll('.service-card');

  serviceTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selectedFilter = tab.getAttribute('data-filter');

      // Mise à jour de l'état actif sur les onglets
      serviceTabs.forEach((t) => {
        const isCurrent = t === tab;
        t.classList.toggle('is-active', isCurrent);
        t.setAttribute('aria-selected', String(isCurrent));
      });

      // Affichage/masquage des cartes correspondantes
      serviceCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedFilter === 'all' || cardCategory === selectedFilter) {
          card.removeAttribute('hidden');
        } else {
          card.setAttribute('hidden', '');
        }
      });
    });
  });

  // Boutons "Sélectionner pour un devis" sur chaque carte de service
  const selectServiceButtons = document.querySelectorAll('.btn-select-service');
  const serviceSelectInput = document.getElementById('service-type');
  const quoteSection = document.getElementById('devis');
  const fullNameInput = document.getElementById('full-name');

  selectServiceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const serviceValue = button.getAttribute('data-service-value');
      if (serviceSelectInput && serviceValue) {
        serviceSelectInput.value = serviceValue;
        clearFieldError(serviceSelectInput, 'error-service-type');
      }
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: getScrollBehavior() });
      }
      if (fullNameInput) {
        setTimeout(() => fullNameInput.focus(), 250);
      }
    });
  });

  /* ========================================================================
     3. ACCORDÉON FAQ ACCESSIBLE
     ======================================================================== */
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;

      trigger.setAttribute('aria-expanded', String(!isExpanded));
      if (panel) {
        if (isExpanded) {
          panel.setAttribute('hidden', '');
        } else {
          panel.removeAttribute('hidden');
        }
      }
    });
  });

  /* ========================================================================
     4. VALIDATION DU FORMULAIRE DE DEVIS & CONFIRMATION DÉMO
     ======================================================================== */
  const quoteForm = document.getElementById('quote-form');
  const demoConfirmation = document.getElementById('demo-confirmation');
  const resetDemoButton = document.getElementById('reset-demo-form');

  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  // Expression régulière standard et fiable pour le format d'adresse e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function showFieldError(inputEl, errorId, errorMessage) {
    const errorEl = document.getElementById(errorId);
    if (inputEl) {
      inputEl.setAttribute('aria-invalid', 'true');
    }
    if (errorEl) {
      errorEl.textContent = errorMessage;
      errorEl.removeAttribute('hidden');
    }
  }

  function clearFieldError(inputEl, errorId) {
    const errorEl = document.getElementById(errorId);
    if (inputEl) {
      inputEl.setAttribute('aria-invalid', 'false');
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.setAttribute('hidden', '');
    }
  }

  function validateForm() {
    let isValid = true;
    let firstInvalidField = null;

    // 1. Validation du nom
    const nameValue = fullNameInput ? fullNameInput.value.trim() : '';
    if (!nameValue || nameValue.length < 2) {
      showFieldError(
        fullNameInput,
        'error-full-name',
        'Veuillez indiquer votre nom complet ou le nom de votre structure (minimum 2 caractères).'
      );
      isValid = false;
      if (!firstInvalidField) firstInvalidField = fullNameInput;
    } else {
      clearFieldError(fullNameInput, 'error-full-name');
    }

    // 2. Validation de l'e-mail
    const emailValue = emailInput ? emailInput.value.trim() : '';
    if (!emailValue) {
      showFieldError(emailInput, 'error-email', 'Veuillez renseigner une adresse e-mail de contact.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = emailInput;
    } else if (!emailRegex.test(emailValue)) {
      showFieldError(
        emailInput,
        'error-email',
        'Veuillez saisir une adresse e-mail au format valide (ex. : nom@domaine.fr).'
      );
      isValid = false;
      if (!firstInvalidField) firstInvalidField = emailInput;
    } else {
      clearFieldError(emailInput, 'error-email');
    }

    // 3. Validation du type de prestation
    const serviceValue = serviceSelectInput ? serviceSelectInput.value.trim() : '';
    if (!serviceValue) {
      showFieldError(
        serviceSelectInput,
        'error-service-type',
        'Veuillez sélectionner l’une des trois prestations proposées.'
      );
      isValid = false;
      if (!firstInvalidField) firstInvalidField = serviceSelectInput;
    } else {
      clearFieldError(serviceSelectInput, 'error-service-type');
    }

    // 4. Validation du message
    const messageValue = messageInput ? messageInput.value.trim() : '';
    if (!messageValue || messageValue.length < 10) {
      showFieldError(
        messageInput,
        'error-message',
        'Veuillez préciser votre besoin en quelques mots (minimum 10 caractères).'
      );
      isValid = false;
      if (!firstInvalidField) firstInvalidField = messageInput;
    } else {
      clearFieldError(messageInput, 'error-message');
    }

    if (firstInvalidField) {
      firstInvalidField.focus();
    }

    return {
      isValid,
      values: {
        name: nameValue,
        email: emailValue,
        service: serviceValue,
        message: messageValue,
      },
    };
  }

  // Effacer l'erreur dès la saisie
  const watchedFields = [
    { el: fullNameInput, err: 'error-full-name' },
    { el: emailInput, err: 'error-email' },
    { el: serviceSelectInput, err: 'error-service-type' },
    { el: messageInput, err: 'error-message' },
  ];

  watchedFields.forEach(({ el, err }) => {
    if (el) {
      el.addEventListener('input', () => clearFieldError(el, err));
      el.addEventListener('change', () => clearFieldError(el, err));
    }
  });

  if (quoteForm && demoConfirmation) {
    quoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = validateForm();

      if (!result.isValid) return;

      // Renseigner le récapitulatif de démonstration
      const confirmName = document.getElementById('confirm-name');
      const confirmEmail = document.getElementById('confirm-email');
      const confirmService = document.getElementById('confirm-service');
      const confirmMessage = document.getElementById('confirm-message');

      if (confirmName) confirmName.textContent = result.values.name;
      if (confirmEmail) confirmEmail.textContent = result.values.email;
      if (confirmService) confirmService.textContent = result.values.service;
      if (confirmMessage) confirmMessage.textContent = result.values.message;

      // Masquer le formulaire et afficher l'état de confirmation démo
      quoteForm.setAttribute('hidden', '');
      demoConfirmation.removeAttribute('hidden');
      demoConfirmation.focus();
    });
  }

  if (resetDemoButton && quoteForm && demoConfirmation) {
    resetDemoButton.addEventListener('click', () => {
      quoteForm.reset();
      demoConfirmation.setAttribute('hidden', '');
      quoteForm.removeAttribute('hidden');
      if (fullNameInput) fullNameInput.focus();
    });
  }

  /* ========================================================================
     UTILITAIRE : Respect de prefers-reduced-motion pour le défilement
     ======================================================================== */
  function getScrollBehavior() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prefersReducedMotion ? 'auto' : 'smooth';
  }
});