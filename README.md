# Personal Dashboard

A clean, minimal bookmark dashboard to replace your cluttered Chrome bookmark bar. Set it as your browser's startup page for quick access to all your frequently used sites.

## Features

- **Dark mode by default** - Easy on the eyes
- **Pinned favorites** - Quick access to your most-used links at the top
- **Categories** - Organize links into collapsible sections
- **Search** - Instantly filter links as you type
- **Keyboard navigation** - Fast access without touching the mouse
- **Drag and drop** - Reorder links within categories
- **Import/Export** - Backup and restore your links as JSON
- **LocalStorage persistence** - Your customizations survive page reloads
- **No backend required** - Pure static site, deploy anywhere

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search bar |
| `Esc` | Clear search or unfocus |
| `↑` / `↓` | Navigate through visible links |
| `Enter` | Open highlighted link in new tab |

## Local Development

No build step required. Just serve the files:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Customizing Links

### Method 1: Edit the data file directly

Edit `src/data/links.js` to change the default links:

```javascript
{
  id: "unique-id",
  title: "Link Title",
  url: "https://example.com",
  category: "Category Name",
  pinned: false,        // Show in pinned section
  icon: "🔗",           // Optional emoji icon
  favicon: "",          // Optional custom favicon URL
  description: "",      // Optional description
  keywords: "",         // Optional search keywords
  order: 1              // Sort order within category
}
```

### Method 2: Import JSON

1. Click the **Import** button
2. Select a JSON file with your links array
3. Your imported links will be saved to localStorage

### Method 3: Export and edit

1. Click **Export** to download your current links
2. Edit the JSON file
3. Import it back

## Deploy to Netlify

### Option 1: Drag and drop

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your project folder onto the page
3. Done! Your site is live.

### Option 2: Connect to Git

1. Push this repo to GitHub/GitLab/Bitbucket
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your repo
5. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `.` or `/`
6. Deploy!

### Option 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy (creates a draft URL)
netlify deploy

# Deploy to production
netlify deploy --prod
```

## Setting as Chrome Startup Page

1. Deploy your dashboard to Netlify (or any host)
2. Copy your site URL
3. In Chrome: Settings → On startup → Open a specific page
4. Add your dashboard URL

## File Structure

```
├── index.html              # Main HTML file
├── src/
│   ├── css/
│   │   └── styles.css      # Custom styles
│   ├── data/
│   │   └── links.js        # Default links data
│   └── js/
│       ├── app.js          # Main application logic
│       ├── dragdrop.js     # Drag and drop functionality
│       ├── keyboard.js     # Keyboard navigation
│       ├── search.js       # Search/filter logic
│       └── storage.js      # LocalStorage handling
├── netlify.toml            # Netlify config (optional)
└── README.md
```

## Data Persistence

- **Default links** are defined in `src/data/links.js`
- **User customizations** (imported links, reordering) are saved to localStorage
- Click **Reset** to clear localStorage and revert to defaults
- **Export** your links regularly to back them up

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Uses ES modules, so no IE11 support.

## Tech Stack

- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript (ES modules)
- No build tools required

## License

MIT - Use it however you want.
