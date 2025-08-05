class Tooltip {
  static #instance;
  element = null;
  currentTarget = null;

  constructor() {
    if (Tooltip.#instance) {
      return Tooltip.#instance;
    }
    Tooltip.#instance = this;
  }

  initialize() {
    document.addEventListener('pointerover', (event) => {
      const curTooltip = event.target.closest('[data-tooltip]');
      if (curTooltip) this.showTooltip(curTooltip, event);
    });
  }

  render(strTooltip) {
    if (!this.element) {
      this.createTooltip(strTooltip);
    } else {
      this.element.textContent = strTooltip;
    }
  }

  createTooltip(strTooltip = '') {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.textContent = strTooltip;
    document.body.append(this.element);
  }

  moveTooltip = (event) => {
    if (!this.element) return;
    this.element.style.left = `${event.clientX}px`;
    this.element.style.top = `${event.clientY}px`;
  };

  removeTooltip = (event) => {
    if (!this.element) return;
	if (!event.target) return;
    
    event.target.removeEventListener('pointermove', this.moveTooltip);
    event.target.removeEventListener('pointerout', this.removeTooltip);
    
    this.element.remove();
    this.element = null;
    this.currentTarget = null;
  };

  showTooltip = (curTooltip, event) => {
    if (this.element) {
      this.removeTooltip(event);
    }
    
    this.currentTarget = curTooltip;
    this.createTooltip(curTooltip.dataset.tooltip);
    this.moveTooltip(event);
    
    curTooltip.addEventListener('pointermove', this.moveTooltip);
    curTooltip.addEventListener('pointerout', this.removeTooltip);
  };

  destroy() {
    if (this.element) {
      this.removeTooltip({ target: this.currentTarget });
    }
    Tooltip.#instance = null;
  }
}

export default Tooltip;