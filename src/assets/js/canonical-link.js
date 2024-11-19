document.addEventListener('DOMContentLoaded', function() {
  // Get the current page URL
  const currentURL = window.location.href;

  // Find the canonical link element
  let canonicalLink = document.querySelector('link[rel="canonical"]');

  // If the canonical link doesn't exist, create it
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }

  // Set or update the href attribute of the canonical link
  canonicalLink.href = currentURL;

  // Optional: Remove any query parameters or hash from the canonical URL
  const urlWithoutParams = currentURL.split('?')[0].split('#')[0];
  canonicalLink.href = urlWithoutParams;

  console.log('Canonical link set to:', canonicalLink.href);
});
