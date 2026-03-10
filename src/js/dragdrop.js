/**
 * Drag and drop module
 * Handles reordering links within a category
 */

export const dragdrop = {
  draggedElement: null,
  draggedLinkId: null,
  onReorder: null,

  init(onReorder) {
    this.onReorder = onReorder;
  },

  // Make a link element draggable
  makeDraggable(element, linkId) {
    element.setAttribute('draggable', 'true');
    element.dataset.linkId = linkId;

    element.addEventListener('dragstart', (e) => this.handleDragStart(e));
    element.addEventListener('dragend', (e) => this.handleDragEnd(e));
    element.addEventListener('dragover', (e) => this.handleDragOver(e));
    element.addEventListener('dragenter', (e) => this.handleDragEnter(e));
    element.addEventListener('dragleave', (e) => this.handleDragLeave(e));
    element.addEventListener('drop', (e) => this.handleDrop(e));
  },

  handleDragStart(e) {
    this.draggedElement = e.target.closest('.link-item');
    this.draggedLinkId = this.draggedElement?.dataset.linkId;
    
    if (this.draggedElement) {
      this.draggedElement.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', this.draggedLinkId);
    }
  },

  handleDragEnd(e) {
    if (this.draggedElement) {
      this.draggedElement.classList.remove('dragging');
    }
    
    // Remove all drag-over classes
    document.querySelectorAll('.drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
    
    this.draggedElement = null;
    this.draggedLinkId = null;
  },

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  },

  handleDragEnter(e) {
    e.preventDefault();
    const target = e.target.closest('.link-item');
    
    if (target && target !== this.draggedElement) {
      // Only allow drop in same category
      const draggedCategory = this.draggedElement?.closest('.category-section')?.dataset.category;
      const targetCategory = target.closest('.category-section')?.dataset.category;
      
      if (draggedCategory === targetCategory) {
        target.classList.add('drag-over');
      }
    }
  },

  handleDragLeave(e) {
    const target = e.target.closest('.link-item');
    if (target) {
      target.classList.remove('drag-over');
    }
  },

  handleDrop(e) {
    e.preventDefault();
    
    const target = e.target.closest('.link-item');
    if (!target || target === this.draggedElement) return;
    
    const targetLinkId = target.dataset.linkId;
    const draggedCategory = this.draggedElement?.closest('.category-section')?.dataset.category;
    const targetCategory = target.closest('.category-section')?.dataset.category;
    
    // Only allow reorder within same category
    if (draggedCategory !== targetCategory) return;
    
    target.classList.remove('drag-over');
    
    // Call the reorder callback
    if (this.onReorder && this.draggedLinkId && targetLinkId) {
      this.onReorder(this.draggedLinkId, targetLinkId, draggedCategory);
    }
  }
};
