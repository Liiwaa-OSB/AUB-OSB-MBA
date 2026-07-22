// (function () {
//   // Make entire program card clickable, but ignore clicks on the button itself
//   const cards = document.querySelectorAll(".program-card");
//   cards.forEach((card) => {
//     card.addEventListener("click", function (e) {
//       // If the clicked element is an <a> tag or inside an <a>, let the browser handle it normally.
//       if (e.target.closest("a")) return;

//       // Otherwise, navigate to the URL stored in data-url
//       const url = this.dataset.url;
//       if (url) {
//         window.location.href = url;
//       }
//     });
//   });
// })();

// window.addEventListener('scroll', function() {
//   if (window.scrollY > 100) {
//     document.body.classList.add('nav-scrolled');
//   } else {
//     document.body.classList.remove('nav-scrolled');
//   }
// });

(function () {
  "use strict";

  function forEachElement(elements, callback) {
    Array.prototype.forEach.call(elements, callback);
  }

  /* ========================================
     Scroll reveal animation
  ======================================== */

  function initializeRevealAnimations() {
    var revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) {
      return;
    }

    var reducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      forEachElement(revealElements, function (element) {
        element.classList.add("visible");
      });

      return;
    }

    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        forEachElement(entries, function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12
      }
    );

    forEachElement(revealElements, function (element) {
      revealObserver.observe(element);
    });
  }

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
    elements.answer.style.maxHeight =
      elements.answer.scrollHeight + "px";
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

        forEachElement(faqItems, function (faqItem) {
          closeFaqItem(faqItem);
        });

        if (shouldOpen) {
          openFaqItem(item);
        }
      });
    });

    window.addEventListener("resize", function () {
      var openItems = document.querySelectorAll(".faq-item.active");

      forEachElement(openItems, function (item) {
        var elements = getFaqElements(item);

        if (elements.answer) {
          elements.answer.style.maxHeight =
            elements.answer.scrollHeight + "px";
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