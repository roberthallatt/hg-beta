import './assets/scss/main.scss'
import './assets/js/canonical-link.js'
// encode email

function protectEmail(email) {
    var encoded = "";
    for (var i = 0; i < email.length; i++) {
        encoded += "&#" + email.charCodeAt(i) + ";";
    }
    return encoded;
}

function decodeEmail(encodedEmail) {
    return encodedEmail.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
}

function setupEmailProtection() {
    var emailElements = document.querySelectorAll('.protected-email');
    emailElements.forEach(function(element) {
        var encodedEmail = element.getAttribute('data-email');
        var decodedEmail = decodeEmail(encodedEmail);

        element.innerHTML = '<a href="#" class="email-link">' + encodedEmail + '</a>';

        element.querySelector('.email-link').addEventListener('click', function(e) {
            e.preventDefault();
            this.innerHTML = decodedEmail;
            this.href = 'mailto:' + decodedEmail;
        });
    });
}

document.addEventListener('DOMContentLoaded', setupEmailProtection);

// var email = "";
// var encoded = protectEmail(email);
// console.log(encoded);


// Skip to main content link

document.addEventListener('DOMContentLoaded', function() {
  var skipLink = document.getElementById('skip-link');
  var mainContent = document.getElementById('main-body');

  if (skipLink && mainContent) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      mainContent.focus();
      mainContent.scrollIntoView({behavior: 'smooth', block: 'start'});
    });

    // Ensure the main content can receive focus
    if (!mainContent.hasAttribute('tabindex')) {
      mainContent.setAttribute('tabindex', '-1');
    }

    // Remove focus from main content when it's no longer needed
    mainContent.addEventListener('blur', function() {
      mainContent.removeAttribute('tabindex');
    });
  }
});

// Add print header

document.addEventListener('DOMContentLoaded', function() {
  var urlElement = document.querySelector('.print-url');
  if (urlElement) {
    urlElement.textContent = "URL: " + window.location.href;
  }
});

// make sure the print header is visible when printing

document.addEventListener('DOMContentLoaded', function() {
  if (window.matchMedia) {
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function(mql) {
      if (mql.matches) {
        prepareForPrint();
      }
    });
  }

  window.onbeforeprint = prepareForPrint;

  function prepareForPrint() {
    var images = document.getElementsByTagName('img');
    var windowHeight = window.innerHeight;

    for (var i = 0; i < images.length; i++) {
      var img = images[i];
      var imgHeight = img.offsetHeight;

      // If image is larger than 3/4 of the page height
      if (imgHeight > windowHeight * 0.75) {
        // Create a div for page break
        var pageBreakDiv = document.createElement('div');
        pageBreakDiv.className = 'page-break';

        // Insert the page break div before the image
        img.parentNode.insertBefore(pageBreakDiv, img);
      }
    }
  }
});

// resize images for print dynamically

document.addEventListener('DOMContentLoaded', function() {
  if (window.matchMedia) {
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function(mql) {
      if (mql.matches) {
        prepareImagesForPrint();
      }
    });
  }

  window.onbeforeprint = prepareImagesForPrint;

  function prepareImagesForPrint() {
    var images = document.getElementsByTagName('img');
    var pageHeight = window.innerHeight;
    var headerHeight = 60; // Adjust this to match your header height

    for (var i = 0; i < images.length; i++) {
      var img = images[i];
      var imgHeight = img.offsetHeight;

      // If image is larger than the available page height
      if (imgHeight > (pageHeight - headerHeight)) {
        img.classList.add('print-fit-page');
        img.style.maxHeight = (pageHeight - headerHeight - 40) + 'px'; // 40px for margins
      }
    }
  }
});