Two different images per certification.

1. BADGE  ->  the "badge" field in js/data.js
   The square credential badge. Card display only.
   Square, 600-800px, PNG with transparency (Credly badges are already this).
   Present here now:
       responsive-web-design.png          <- MISSING, placeholder showing
       computer-hardware-basics.png
       it-specialist-cybersecurity.png
       it-specialist-network-security.png
       it-specialist-networking.png
       it-specialist-html-and-css.png

2. CERTIFICATE  ->  the "certificate" field in js/data.js
   The actual certificate document, shown only in the modal.
   Landscape, 1400-1800px on the long edge, JPG at quality ~80.
   Suggested naming:  <same-slug>-certificate.jpg

   The "View certificate" button appears ONLY on cards that have this field.
   Add the field when you have the scan; leave it out until then.

Notes
  - The two are independent. A missing badge shows a glyph placeholder and does
    not affect the View button; a card with no certificate simply has no button.
  - If a certificate path is set but the file is missing, the modal says so
    rather than showing a broken image.
  - Keep each file under ~300 KB.
