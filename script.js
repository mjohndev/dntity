'use strict';

// ============================================================
// CONFIGURATION
// ============================================================

// Contact email address used for all inquiries.
const CONTACT_EMAIL = "contact@dntity.com";

// Site URL (change if your final domain is different).
const SITE_URL = "https://dntity.com";

// Brand name and tagline shown in SEO titles and metadata.
const BRAND_NAME = "Dntity.com";
const BRAND_TAGLINE = "Your Digital Identity";

// ============================================================
// DOM REFERENCES
// ============================================================
const titleLead = document.getElementById('titleLead');
const titleSubject = document.getElementById('titleSubject');
const titleDomain = document.getElementById('titleDomain');
const heroSub = document.getElementById('heroSub');
const heroDesc = document.getElementById('heroDesc');
const inquiryLabel = document.getElementById('inquiryLabel');
const inquiryDomain = document.getElementById('inquiryDomain');
const inquiryHint = document.getElementById('inquiryHint');
const cta = document.getElementById('cta');
const canonicalLink = document.getElementById('canonicalLink');

// ============================================================
// GOOGLE ANALYTICS 4
// ============================================================
function initGA() {
  const id = window.GA_MEASUREMENT_ID;
  if (!id || id === 'G-XXXXXXXXXX') return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { send_page_view: true });
}

initGA();

// ============================================================
// DOMAIN PARAMETER HANDLING
// ============================================================
function getDomainParam() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('domain');
  if (!raw) return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Basic hostname validation. Allows letters, numbers, dots, hyphens.
  const domainRegex = /^(?=.{1,253}$)(?!-)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;
  if (!domainRegex.test(trimmed)) return null;

  return trimmed;
}

const detectedDomain = getDomainParam();

// ============================================================
// META HELPERS
// ============================================================
function setMeta(attr, value, isProperty) {
  const selector = isProperty ? `meta[property="${attr}"]` : `meta[name="${attr}"]`;
  let el = document.querySelector(selector);

  if (!el) {
    el = document.createElement('meta');
    if (isProperty) el.setAttribute('property', attr);
    else el.setAttribute('name', attr);
    document.head.appendChild(el);
  }

  el.setAttribute('content', value);
}

// ============================================================
// APPLY DOMAIN TO PAGE
// ============================================================
function applyDomain(domain) {
  const hasDomain = !!domain;

  if (hasDomain) {
    // ---------- Domain-specific view ----------
    titleLead.textContent = 'Interested in';
    titleSubject.style.display = '';
    titleDomain.textContent = domain;

    heroSub.textContent = 'You found one of our domain.';
    heroDesc.textContent = "If you'd like to acquire it, make an inquiry.";

    inquiryLabel.textContent = 'Domain for acquisition';
    inquiryDomain.textContent = domain;
    inquiryHint.textContent = "Looking for this domain? Let's talk.";

    // SEO
    const pageTitle = `${domain} — Domain Inquiry | ${BRAND_NAME}`;
    document.title = pageTitle;

    const metaDesc = `${domain} is available for acquisition. Contact us directly for availability and pricing.`;

    setMeta('description', metaDesc);
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', metaDesc, true);
    setMeta('og:url', `${SITE_URL}/?domain=${encodeURIComponent(domain)}`, true);
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', metaDesc);

    if (canonicalLink) {
      canonicalLink.href = `${SITE_URL}/?domain=${encodeURIComponent(domain)}`;
    }
  } else {
    // ---------- Brand fallback view ----------
    titleLead.textContent = 'Looking for a domain?';
    titleSubject.style.display = 'none';

    heroSub.textContent = 'Premium domain names available for acquisition.';
    heroDesc.textContent =
      "If you're interested in acquiring any of our domain names, feel free to contact us for availability and pricing.";

    inquiryLabel.textContent = 'Domain inquiry';
    inquiryDomain.textContent = 'Available domain names';
    inquiryHint.textContent =
      "Have a specific domain in mind? Send us a message and we'll reply with availability and pricing.";

    // SEO
    const pageTitle = `${BRAND_NAME} - ${BRAND_TAGLINE}`;
    document.title = pageTitle;

    const metaDesc =
      'Dntity.com - Your Digital Identity. Premium domain names available for acquisition. Contact us directly for availability and pricing.';

    setMeta('description', metaDesc);
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', metaDesc, true);
    setMeta('og:url', SITE_URL, true);
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', metaDesc);

    if (canonicalLink) {
      canonicalLink.href = SITE_URL;
    }
  }

  // ---------- Email (shared) ----------
  const subject = hasDomain ? `Inquiry about ${domain}` : 'Domain inquiry';
  const body = hasDomain
    ? `Hello,\n\nI am interested in acquiring ${domain}.\n\nPlease let me know the availability and asking price.\n\nThank you.`
    : `Hello,\n\nI am interested in acquiring a domain name.\n\nPlease let me know the availability and asking price.\n\nThank you.`;

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  cta.href = mailto;
  cta.setAttribute(
    'aria-label',
    hasDomain ? `Make an inquiry about ${domain}` : 'Make an inquiry by email'
  );

  // ---------- Analytics: domain view ----------
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'domain_view', {
      domain_name: hasDomain ? domain : 'none'
    });
  }
}

applyDomain(detectedDomain);

// ============================================================
// INQUIRY CLICK TRACKING
// ============================================================
cta.addEventListener('click', function () {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'domain_inquiry_click', {
      domain_name: detectedDomain || 'none'
    });
  }
});