/**
 * Main application module
 * Orchestrates rendering, search, keyboard, drag-drop, and storage
 */

import { defaultLinks, categoryOrder } from '../data/links.js';
import { storage } from './storage.js';
import { search } from './search.js';
import { keyboard } from './keyboard.js';
import { dragdrop } from './dragdrop.js';

class Dashboard {
  constructor() {
    this.links = [];
    this.filteredLinks = [];
    this.collapsedCategories = [];
    
    this.init();
  }

  init() {
    // Load links from storage or use defaults
    const storedLinks = storage.getLinks();
    this.links = storedLinks || [...defaultLinks];
    this.collapsedCategories = storage.getCollapsedCategories();

    // Initialize modules
    keyboard.init();
    dragdrop.init((draggedId, targetId, category) => {
      this.reorderLinks(draggedId, targetId, category);
    });

    // Set up event listeners
    this.setupEventListeners();

    // Initial render
    this.render();
  }

  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input');
    const searchHint = document.getElementById('search-hint');
    
    searchInput?.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    searchInput?.addEventListener('focus', () => {
      searchHint?.classList.add('hidden');
    });

    searchInput?.addEventListener('blur', () => {
      if (!searchInput.value) {
        searchHint?.classList.remove('hidden');
      }
    });

    // Import button
    document.getElementById('import-btn')?.addEventListener('click', () => {
      document.getElementById('import-file')?.click();
    });

    // Import file input
    document.getElementById('import-file')?.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const importedLinks = await storage.importLinks(file);
          this.links = importedLinks;
          storage.saveLinks(this.links);
          this.render();
          this.showToast('Links imported successfully!');
        } catch (err) {
          this.showToast(`Import failed: ${err.message}`, 'error');
        }
        e.target.value = '';
      }
    });

    // Export button
    document.getElementById('export-btn')?.addEventListener('click', () => {
      storage.exportLinks(this.links);
      this.showToast('Links exported!');
    });

    // Reset button
    document.getElementById('reset-btn')?.addEventListener('click', () => {
      if (confirm('Reset all links to defaults? This will clear any imported data.')) {
        storage.clearLinks();
        this.links = [...defaultLinks];
        this.render();
        this.showToast('Links reset to defaults');
      }
    });
  }

  handleSearch(query) {
    this.filteredLinks = search.filterLinks(this.links, query);
    this.render();
    keyboard.updateVisibleLinks();
  }

  render() {
    const linksToRender = search.currentQuery ? this.filteredLinks : this.links;
    
    this.renderPinned(linksToRender);
    this.renderCategories(linksToRender);
    
    // Update keyboard navigation
    keyboard.updateVisibleLinks();
  }

  renderPinned(links) {
    const container = document.getElementById('pinned-links');
    const section = document.getElementById('pinned-section');
    if (!container || !section) return;

    const pinnedLinks = links.filter(link => link.pinned);
    
    if (pinnedLinks.length === 0) {
      section.classList.add('hidden');
      return;
    }
    
    section.classList.remove('hidden');
    container.innerHTML = pinnedLinks.map(link => this.renderLinkCard(link, true)).join('');
    
    // Make links draggable
    container.querySelectorAll('.link-item').forEach(el => {
      dragdrop.makeDraggable(el, el.dataset.linkId);
    });
  }

  renderCategories(links) {
    const container = document.getElementById('categories-container');
    if (!container) return;

    // Group links by category
    const grouped = this.groupByCategory(links);
    
    // Sort categories by defined order
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a);
      const bIndex = categoryOrder.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    container.innerHTML = sortedCategories.map(category => {
      const categoryLinks = grouped[category].sort((a, b) => (a.order || 0) - (b.order || 0));
      const isCollapsed = this.collapsedCategories.includes(category);
      
      return `
        <section class="category-section mb-6" data-category="${category}">
          <button 
            class="category-header w-full flex items-center justify-between py-2 px-1 text-left group"
            data-category="${category}"
          >
            <h2 class="text-lg font-semibold text-gray-300 group-hover:text-gray-100 transition-colors">
              ${category}
              <span class="text-sm font-normal text-gray-500 ml-2">${categoryLinks.length}</span>
            </h2>
            <svg 
              class="w-5 h-5 text-gray-500 transition-transform ${isCollapsed ? '-rotate-90' : ''}" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div class="category-content ${isCollapsed ? 'hidden' : ''}">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-2">
              ${categoryLinks.map(link => this.renderLinkCard(link)).join('')}
            </div>
          </div>
        </section>
      `;
    }).join('');

    // Add collapse toggle listeners
    container.querySelectorAll('.category-header').forEach(header => {
      header.addEventListener('click', () => {
        const category = header.dataset.category;
        this.toggleCategory(category);
      });
    });

    // Make links draggable
    container.querySelectorAll('.link-item').forEach(el => {
      dragdrop.makeDraggable(el, el.dataset.linkId);
    });
  }

  renderLinkCard(link, isPinnedSection = false) {
    const faviconUrl = link.favicon || this.getFaviconUrl(link.url);
    const icon = link.icon || '';
    const description = link.description || '';
    
    // Highlight search matches
    const displayTitle = search.currentQuery 
      ? search.highlightMatch(link.title, search.currentQuery)
      : link.title;
    const displayDesc = search.currentQuery && description
      ? search.highlightMatch(description, search.currentQuery)
      : description;

    return `
      <div 
        class="link-item bg-dark-card border border-dark-border rounded-lg hover:bg-dark-hover hover:border-gray-600 transition-all cursor-grab active:cursor-grabbing"
        data-link-id="${link.id}"
      >
        <a 
          href="${link.url}" 
          target="_blank" 
          rel="noopener noreferrer"
          class="flex items-center gap-3 p-3"
        >
          <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-dark-border">
            ${icon 
              ? `<span class="text-lg">${icon}</span>`
              : `<img 
                  src="${faviconUrl}" 
                  alt="" 
                  class="w-5 h-5 rounded"
                  onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
                >
                <span class="hidden w-5 h-5 items-center justify-center text-xs font-bold text-gray-400">
                  ${link.title.charAt(0).toUpperCase()}
                </span>`
            }
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-100 truncate">${displayTitle}</div>
            ${displayDesc ? `<div class="text-xs text-gray-500 truncate mt-0.5">${displayDesc}</div>` : ''}
          </div>
          ${link.pinned && !isPinnedSection ? `
            <svg class="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          ` : ''}
        </a>
      </div>
    `;
  }

  getFaviconUrl(url) {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '';
    }
  }

  groupByCategory(links) {
    return links.reduce((acc, link) => {
      const category = link.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(link);
      return acc;
    }, {});
  }

  toggleCategory(category) {
    this.collapsedCategories = storage.toggleCategoryCollapsed(category);
    
    const section = document.querySelector(`.category-section[data-category="${category}"]`);
    if (!section) return;

    const content = section.querySelector('.category-content');
    const arrow = section.querySelector('svg');
    const isCollapsed = this.collapsedCategories.includes(category);

    content?.classList.toggle('hidden', isCollapsed);
    arrow?.classList.toggle('-rotate-90', isCollapsed);
  }

  reorderLinks(draggedId, targetId, category) {
    const draggedIndex = this.links.findIndex(l => l.id === draggedId);
    const targetIndex = this.links.findIndex(l => l.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    // Get links in this category
    const categoryLinks = this.links
      .filter(l => l.category === category)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Find positions within category
    const draggedCatIndex = categoryLinks.findIndex(l => l.id === draggedId);
    const targetCatIndex = categoryLinks.findIndex(l => l.id === targetId);

    // Reorder within category
    const [removed] = categoryLinks.splice(draggedCatIndex, 1);
    categoryLinks.splice(targetCatIndex, 0, removed);

    // Update order values
    categoryLinks.forEach((link, index) => {
      const mainIndex = this.links.findIndex(l => l.id === link.id);
      if (mainIndex !== -1) {
        this.links[mainIndex].order = index + 1;
      }
    });

    // Save and re-render
    storage.saveLinks(this.links);
    this.render();
  }

  showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast fixed bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-medium z-50 transition-opacity ${
      type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new Dashboard();
});
