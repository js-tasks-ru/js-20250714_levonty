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
	
	document.addEventListener('pointerover',this.handlePointerover);
	document.addEventListener('pointermove',this.handlePointermove);
	document.addEventListener('pointerout',this.handlePointerout);
  }
  
  handlePointerover = (event) => {
	  const curTooltip = event.target.closest('[data-tooltip]');

	  if (curTooltip) {
		  this.showTooltip(event);
	  }
  }
  
  handlePointermove = (event) => {
	const curTooltip = event.target.closest('[data-tooltip]');
    if (!curTooltip) return;
	if (!this.element) {return;}
	this.element.style.left = `${event.clientX + 10}px`;
	this.element.style.top = `${event.clientY + 10}px`;	  
  }
  
  handlePointerout = (event) => {
    if (!this.element) {return;}
    if (!event.target) {return;}
	
    this.element.remove();
    this.element = null;
  };  
  
  showTooltip = (event)=>{

	if (this.element) {
		this.removeTooltip(event);
	}
	
	const curTooltip = event.target.closest('[data-tooltip]');
    if (!curTooltip) return;
    this.createTooltip(curTooltip.dataset.tooltip,event);
	  
  }
  
  render(strTooltip, event) {
    if (!this.element) {
      this.createTooltip(strTooltip, event = null);
    } else {
      this.element.textContent = strTooltip;
    }
  }

  createTooltip(strTooltip = '', event = null) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.textContent = strTooltip;
    document.body.append(this.element);
	
	if (event) {
		this.element.style.left = `${event.clientX + 10}px`;
		this.element.style.top = `${event.clientY + 10}px`;	
	}
  }


  destroy() {
	this.element = null;
	document.removeEventListener('pointerover',this.handlePointerover);
	document.removeEventListener('pointermove',this.handlePointermove);
	document.removeEventListener('pointerout',this.handlePointerout);	
	Tooltip.#instance = null;
  }
}

export default Tooltip;