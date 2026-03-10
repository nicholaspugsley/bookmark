/**
 * Storage module - handles localStorage operations
 * Manages link data persistence and UI state
 */

const STORAGE_KEYS = {
  LINKS: 'dashboard_links',
  COLLAPSED: 'dashboard_collapsed_categories',
  ORDER: 'dashboard_category_order'
};

export const storage = {
  // Get links from localStorage or return null
  getLinks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LINKS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to parse stored links:', e);
      return null;
    }
  },

  // Save links to localStorage
  saveLinks(links) {
    try {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
      return true;
    } catch (e) {
      console.error('Failed to save links:', e);
      return false;
    }
  },

  // Clear stored links (revert to defaults)
  clearLinks() {
    localStorage.removeItem(STORAGE_KEYS.LINKS);
  },

  // Get collapsed categories state
  getCollapsedCategories() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COLLAPSED);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Save collapsed categories state
  saveCollapsedCategories(categories) {
    try {
      localStorage.setItem(STORAGE_KEYS.COLLAPSED, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save collapsed state:', e);
    }
  },

  // Toggle a category's collapsed state
  toggleCategoryCollapsed(category) {
    const collapsed = this.getCollapsedCategories();
    const index = collapsed.indexOf(category);
    
    if (index === -1) {
      collapsed.push(category);
    } else {
      collapsed.splice(index, 1);
    }
    
    this.saveCollapsedCategories(collapsed);
    return collapsed;
  },

  // Export links as JSON file
  exportLinks(links) {
    const dataStr = JSON.stringify(links, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-links-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Import links from JSON file
  async importLinks(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const links = JSON.parse(e.target.result);
          
          // Basic validation
          if (!Array.isArray(links)) {
            throw new Error('Invalid format: expected an array');
          }
          
          // Validate each link has required fields
          for (const link of links) {
            if (!link.id || !link.title || !link.url || !link.category) {
              throw new Error('Invalid link: missing required fields (id, title, url, category)');
            }
          }
          
          resolve(links);
        } catch (err) {
          reject(err);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
};
