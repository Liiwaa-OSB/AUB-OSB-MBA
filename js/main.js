(function () {
  "use strict";

  function forEachElement(elements, callback) {
    Array.prototype.forEach.call(elements, callback);
  }

  /* ========================================
     Scroll reveal animation
     One shared observer, created lazily, so content added later
     (e.g. event cards rendered by JS) can be picked up through
     window.__mbaRevealRefresh().
  ======================================== */

  var revealObserver = null;

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  // Once the reveal transition has finished, mark the element so CSS can
  // drop the stagger delay (otherwise hover effects inherit it and feel laggy).
  function markRevealed(element) {
    function onEnd(event) {
      if (event.target !== element || event.propertyName !== "opacity") {
        return;
      }
      element.classList.add("is-revealed");
      element.removeEventListener("transitionend", onEnd);
    }

    element.addEventListener("transitionend", onEnd);
  }

  function showElement(element) {
    element.classList.add("visible");
    markRevealed(element);
  }

  function getRevealObserver() {
    if (revealObserver || !("IntersectionObserver" in window)) {
      return revealObserver;
    }

    revealObserver = new IntersectionObserver(
      function (entries, observer) {
        forEachElement(entries, function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          showElement(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    return revealObserver;
  }

  function initializeRevealAnimations() {
    var pending = document.querySelectorAll(".reveal:not(.visible)");

    if (!pending.length) {
      return;
    }

    var observer = prefersReducedMotion() ? null : getRevealObserver();

    forEachElement(pending, function (element) {
      if (observer) {
        observer.observe(element);
      } else {
        element.classList.add("visible", "is-revealed");
      }
    });
  }

  // Re-scan for new .reveal elements added after page load.
  window.__mbaRevealRefresh = initializeRevealAnimations;

  /* ========================================
     FAQ accordion
  ======================================== */

  function getFaqElements(item) {
    return {
      question: item.querySelector(".faq-question"),
      answer: item.querySelector(".faq-answer")
    };
  }

  function closeFaqItem(item) {
    var elements = getFaqElements(item);

    if (!elements.question || !elements.answer) {
      return;
    }

    item.classList.remove("active");
    elements.question.setAttribute("aria-expanded", "false");
    elements.answer.style.maxHeight = "0px";
  }

  function openFaqItem(item) {
    var elements = getFaqElements(item);

    if (!elements.question || !elements.answer) {
      return;
    }

    item.classList.add("active");
    elements.question.setAttribute("aria-expanded", "true");
    elements.answer.style.maxHeight = elements.answer.scrollHeight + "px";
  }

  function initializeFaqAccordion() {
    var faqItems = document.querySelectorAll(".faq-item");

    if (!faqItems.length) {
      return;
    }

    forEachElement(faqItems, function (item) {
      var elements = getFaqElements(item);

      if (!elements.question || !elements.answer) {
        return;
      }

      var initiallyOpen =
        item.classList.contains("active") ||
        elements.question.getAttribute("aria-expanded") === "true";

      if (initiallyOpen) {
        openFaqItem(item);
      } else {
        closeFaqItem(item);
      }

      elements.question.addEventListener("click", function () {
        var shouldOpen = !item.classList.contains("active");

        forEachElement(faqItems, closeFaqItem);

        if (shouldOpen) {
          openFaqItem(item);
        }
      });
    });

    window.addEventListener("resize", function () {
      forEachElement(document.querySelectorAll(".faq-item.active"), function (item) {
        var elements = getFaqElements(item);

        if (elements.answer) {
          elements.answer.style.maxHeight = elements.answer.scrollHeight + "px";
        }
      });
    });
  }

  /* ========================================
     Initialize shared components
  ======================================== */

  function initializePage() {
    initializeRevealAnimations();
    initializeFaqAccordion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePage);
  } else {
    initializePage();
  }
})();
