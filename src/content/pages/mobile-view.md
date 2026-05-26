---
title: "Mobile view"
description: "Information regarding the responsive layout design and mobile optimization of Bengal Wiki."
categories:
  - "Official policies"
---

**Bengal Wiki** is built from the ground up utilizing **mobile-first, highly responsive design systems**, ensuring that reading history, culture, and biography profiles feels extremely premium and readable on screens of any size.

---

## Mobile Optimization Features

Our interface automatically adapts when accessed from a smartphone, tablet, or handheld device:
1. **Collapsible Table of Contents**: On smaller screens, the dynamic Table of Contents remains neatly tucked, expandable via the "show" button so it doesn't clutter early paragraphs.
2. **Infobox Responsiveness**: The right-aligned floating facts infobox automatically switches from a side float to a full-width block placed directly underneath the main article title, optimizing vertical scrolling space.
3. **Adaptive Search**: The top navigation search bar expands to full-width on mobile to provide a comfortable typing target, complete with touch-friendly autocomplete dropdown suggestions.
4. **Touch-Optimized Tabs**: The navigation tabs at the top (Home, People, Places, Songs) collapse into a scrollable horizontal swipe-row, allowing rapid category switching with standard touch gestures.

## High-Performance Loading

To accommodate users on mobile networks (3G/4G/5G), Bengal Wiki is optimized for low data consumption:
* **Zero Heavy JS Libraries**: By utilizing Astro's server-side rendering, our pages consist almost entirely of light-weight, raw HTML and CSS.
* **Vector Graphics**: All logos, placeholders, and musical illustrations are inline, highly compressed SVGs that scale perfectly without requiring high-bandwidth image downloads.
