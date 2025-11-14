# MysticAura - Premium Shopify Theme

A modern, responsive Shopify theme featuring dark/light mode switching and AI chatbot integration.

## Features

- **Modern Design**: Clean, premium UI with elegant typography
- **Dark/Light Mode**: Seamless theme switching with localStorage persistence
- **AI Chatbot**: Integrated Gemini-powered chatbot for customer support
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Product Reels**: Instagram-style product showcase
- **Smooth Animations**: Professional transitions and hover effects

## Installation

1. Download the theme files
2. Compress the theme folder into a ZIP file
3. Go to Shopify Admin > Online Store > Themes
4. Click "Upload theme" and select your ZIP file
5. Once uploaded, click "Customize" to edit settings

## Configuration

### Theme Settings

Navigate to **Theme Settings** in the Shopify customizer:

- **Colors**: Customize light and dark mode colors
- **Typography**: Select heading and body fonts
- **Chatbot**: Enable/disable and configure Gemini API key

### Gemini API Setup

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Go to Theme Settings > Chatbot
3. Paste your API key in the "Gemini API Key" field
4. Save changes

## File Structure

```
mysticaura/
├── assets/
│   ├── base.css           # CSS variables and resets
│   ├── theme.css          # Main theme styles
│   ├── theme.js           # Core JavaScript functionality
│   └── chatbot.js         # Chatbot implementation
├── config/
│   └── settings_schema.json
├── layout/
│   └── theme.liquid       # Main layout template
├── sections/
│   ├── header.liquid
│   ├── footer.liquid
│   ├── hero.liquid
│   └── featured-products.liquid
├── snippets/
│   ├── chatbot.liquid
│   ├── product-card.liquid
│   └── meta-tags.liquid
└── templates/
    ├── index.liquid       # Homepage
    ├── collection.liquid  # Collection pages
    ├── product.liquid     # Product pages
    └── page.liquid        # Static pages
```

## Products

This theme is designed to showcase:

1. **7 Horses on Raw Pyrite Frame** - Vastu remedy for prosperity
2. **Dhan Yog Bracelet** - Wealth and abundance bracelet

## Pages

- Home
- Shop/Collections
- Product Pages
- About Us
- Contact
- Privacy Policy
- Refund Policy
- Terms of Service

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Colors

Edit CSS variables in `assets/base.css`:

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-accent: #8b7355;
}
```

### Adding Products

1. Go to Products > Add product
2. Fill in product details
3. Add images (recommended size: 800x800px)
4. Add to collections

### Chatbot Responses

Edit `assets/chatbot.js` to customize bot responses:

```javascript
getMockResponse(userMessage) {
  // Add custom responses here
}
```

## Support

For theme support and customization requests, please contact the developer.

## Credits

- Icons: Lucide Icons (inline SVG)
- Fonts: System fonts for optimal performance
- AI: Google Gemini API

## License

This theme is proprietary. Unauthorized distribution is prohibited.

---

Made with ❤️ for MysticAura