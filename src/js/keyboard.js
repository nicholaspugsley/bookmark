/**
 * Keyboard navigation module
 * Handles "/" to focus search, Esc to clear, arrow keys, and Enter
 */

export const keyboard = {
  currentIndex: -1,
  visibleLinks: [],

  init(onNavigate) {
    this.onNavigate = onNavigate;
    
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  },

  // Update the list of visible/navigable links
  updateVisibleLinks() {
    this.visibleLinks = Array.from(
      document.querySelectorAll('.link-item:not(.hidden)')
    );
    this.currentIndex = -1;
    this.clearHighlight();
  },

  handleKeydown(e) {
    const searchInput = document.getElementById('search-input');
    const isSearchFocused = document.activeElement === searchInput;

    // "/" focuses search (when not already in an input)
    if (e.key === '/' && !isSearchFocused && !this.isInputElement(e.target)) {
      e.preventDefault();
      searchInput?.focus();
      return;
    }

    // Escape clears search or unfocuses
    if (e.key === 'Escape') {
      if (isSearchFocused) {
        if (searchInput.value) {
          searchInput.value = '';
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          searchInput.blur();
        }
      }
      this.clearHighlight();
      this.currentIndex = -1;
      return;
    }

    // Arrow navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.navigate(e.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    // Enter opens highlighted link
    if (e.key === 'Enter' && this.currentIndex >= 0) {
      const link = this.visibleLinks[this.currentIndex];
      if (link) {
        e.preventDefault();
        const anchor = link.querySelector('a');
        if (anchor) {
          window.open(anchor.href, '_blank');
        }
      }
    }
  },

  navigate(direction) {
    if (this.visibleLinks.length === 0) {
      this.updateVisibleLinks();
    }

    if (this.visibleLinks.length === 0) return;

    this.clearHighlight();

    this.currentIndex += direction;

    // Wrap around
    if (this.currentIndex < 0) {
      this.currentIndex = this.visibleLinks.length - 1;
    } else if (this.currentIndex >= this.visibleLinks.length) {
      this.currentIndex = 0;
    }

    this.highlightCurrent();
  },

  highlightCurrent() {
    const current = this.visibleLinks[this.currentIndex];
    if (current) {
      current.classList.add('keyboard-highlight');
      current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  },

  clearHighlight() {
    document.querySelectorAll('.keyboard-highlight').forEach(el => {
      el.classList.remove('keyboard-highlight');
    });
  },

  isInputElement(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName === 'input' || tagName === 'textarea' || element.isContentEditable;
  },

  reset() {
    this.currentIndex = -1;
    this.visibleLinks = [];
    this.clearHighlight();
  }
};
