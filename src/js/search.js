/**
 * Search module - handles filtering links
 */

export const search = {
  currentQuery: '',

  // Filter links based on search query
  filterLinks(links, query) {
    this.currentQuery = query.toLowerCase().trim();
    
    if (!this.currentQuery) {
      return links;
    }

    return links.filter(link => {
      const searchFields = [
        link.title,
        link.description || '',
        link.category,
        link.keywords || '',
        link.url
      ].join(' ').toLowerCase();

      return searchFields.includes(this.currentQuery);
    });
  },

  // Check if a link matches current search
  matchesSearch(link) {
    if (!this.currentQuery) return true;
    
    const searchFields = [
      link.title,
      link.description || '',
      link.category,
      link.keywords || '',
      link.url
    ].join(' ').toLowerCase();

    return searchFields.includes(this.currentQuery);
  },

  // Highlight matching text in a string
  highlightMatch(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-500/30 text-yellow-200 rounded px-0.5">$1</mark>');
  },

  // Clear search
  clear() {
    this.currentQuery = '';
    const input = document.getElementById('search-input');
    if (input) {
      input.value = '';
    }
  }
};

// Escape special regex characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
