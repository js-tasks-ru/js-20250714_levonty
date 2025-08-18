export default class DoubleSlider {
	constructor({
		min = 0, 
		max = 100, 
		formatValue = (value) => `$ + ${value}`, 
		selected = {}
		}={}) {
		this.min = min;
		this.max = max;
		this.from = selected['from'] || this.min;
		this.to = selected['to'] || this.max;
		this.formatValue = formatValue;
		this.subElements = {};

		
		this.element = this.sliderElement(this.sliderTpl);
		this.selectSubElements();
		this.createEventListeners();
		
	}


	sliderElement() {
		const slider = document.createElement('tpl');
		slider.innerHTML = this.sliderTpl();
		return slider.firstElementChild;
	}
	
	sliderTpl() {
			
		const leftProgress = this.getLeftPercent();
		const rightProgress = this.getRightPercent();

		return `
			<div class="range-slider">
			<span data-element="from">${this.formatValue(this.from)}</span>
			<div data-element="container" class="range-slider__inner">
			  <span data-element="progress" class="range-slider__progress" style="left: ${leftProgress}%; right: ${rightProgress}%"></span>
			  <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${leftProgress}%"></span>
			  <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${rightProgress}%"></span>
			</div>
			<span data-element="to">${this.formatValue(this.to)}</span>
			</div>
		  `;

	}
	
	selectSubElements(){

		this.element.querySelectorAll("[data-element]").forEach((element)=>
		{
			this.subElements[element.dataset.element] = element;
		})
	}
	
	getLeftPercent(){
		const total = this.max - this.min;
		const value = this.from - this.min;
		
		return Math.round((value / total) * 100);
	}
	
	getRightPercent() {
		const total = this.max - this.min;
		const value = this.max - this.to;
		
		return Math.round((value / total) * 100);
	}
	
	processPointermove = (e) => {
		const {left, width} = this.subElements.container.getBoundingClientRect();
		
		const containerLeftX = left;
		const containerRightX = left + width;
		const pointerX = e.clientX;
		const normalizedPointerX = Math.min(containerRightX, Math.max(containerLeftX, pointerX));
		const percentPointerX = Math.round((normalizedPointerX - containerLeftX) / (containerRightX - containerLeftX) * 100, 2);
		
		return this.min	+ ((this.max - this.min) * percentPointerX) / 100;
	}
	
	createEventListeners() {
		this.subElements.thumbLeft.addEventListener('pointerdown',this.handleThumbPointerdown);
		this.subElements.thumbRight.addEventListener('pointerdown',this.handleThumbPointerdown);
	}
	
	handleThumbPointerdown = (e) => {
		this.activeThumb = e.target.dataset.element;
		
		document.addEventListener('pointermove',this.handleDocumentPointermove);
		document.addEventListener('pointerup',this.handleDocumentPointerup);
	}
	
	handleDocumentPointermove = (e) => {
		if (this.activeThumb === 'thumbLeft') {
			this.from = Math.min(this.to, this.processPointermove(e));
			this.subElements.from.textContent = this.formatValue(this.from);
			this.subElements.thumbLeft.style.left = this.getLeftPercent() + '%';
			this.subElements.progress.style.left = this.getLeftPercent() + '%';
		}
		
		if (this.activeThumb === 'thumbRight') {
			this.to = Math.max(this.from, this.processPointermove(e));
			this.subElements.to.textContent = this.formatValue(this.to);
			this.subElements.thumbRight.style.right = this.getRightPercent() + '%';
			this.subElements.progress.style.right = this.getRightPercent() + '%';
		}		
	}
	
	handleDocumentPointerup =(e) => {
		this.activeThumb = null;
		this.dispatchCustomEvent();
		
		document.removeEventListener('pointermove',this.handleDocumentPointermove);
		document.removeEventListener('pointerup',this.handleDocumentPointerup);
	}
	
	dispatchCustomEvent() {
		const event = new CustomEvent('range-select',{
			detail: {
				from: this.from,
				to: this.to
			}
		});
		this.element.dispatchEvent(event);
	}
	
	destroyEventListeners(){
		this.subElements.thumbLeft.removeEventListener('pointerdown',this.handleThumbPointerdown);
		this.subElements.thumbRight.removeEventListener('pointerdown',this.handleThumbPointerdown);
	}
	
	remove() {
		this.element.remove();		
	}
	
	destroy(){

		this.destroyEventListeners();
		this.remove();		

	}
	

}

/*

export default class DoubleSlider {
	constructor({min = 0, max = 100, formatValue, selected = {}}={}) {
		this.min = min;
		this.max = max;
		this.from = selected['from'];
		this.to = selected['to'];
		this.formatValue = formatValue || this.defFormatValue;
		
		this.yPos = null;
		
		this.element = this.sliderElement();
		this.initElements(); // Инициализация после создания элемента	

		this.addListeners(this.element);
		
		
	}
	
	defFormatValue = (value) => `$ + ${value}`;

	initElements() {
		//определяем левый и правый тумбнейл, progressBar, находим их координаты
		this.lThumb = this.element.querySelector('.range-slider__thumb-left');
		this.rThumb = this.element.querySelector('.range-slider__thumb-right');	
		this.pBar = this.element.querySelector('.range-slider__progress');
		this.inner = this.element.querySelector('.range-slider__inner');
		
		
		//относительная позиция левого тумблера в слайдере
		this.lThumbX = 0;
		
		//считаем длину и отступ по новому
		this.shiftX = this.inner.getBoundingClientRect().left;
		this.sliderWidth = this.inner.getBoundingClientRect().width;
		
		this.lThumbStartX = this.shiftX;
		this.rThumbStartX = this.shiftX+this.inner.getBoundingClientRect().width;

		
		//относительная позиция правого тумблера
		this.rThumbX = this.rThumbStartX - this.shiftX;

		if (this.from || this.to) this.setSelected(this.from, this.to);
	}
	
	
	sliderElement() {
		
		const minValue = this.from || this.min;
		const maxValue = this.to || this.max;
		const slider = document.createElement('div');
		slider.innerHTML = `
			<span data-element="from">${this.formatValue(minValue)}</span>
			<div data-element="inner" class="range-slider__inner">
			  <span class="range-slider__progress"></span>
			  <span class="range-slider__thumb-left"></span>
			  <span class="range-slider__thumb-right"></span>
			</div>
			<span data-element="to">${this.formatValue(maxValue)}</span>
		  `;
		slider.className = "range-slider";

		return slider;

	}
	
	remove() {
		this.element.remove();		
	}
	
	destroy(){

		this.removeListeners (this.element)	
		this.remove();		

	}
	
	moveAt(obj, clientX, pageY) {
		
		const relPosX = clientX - this.shiftX;
		
		if (obj==this.lThumb) {

			if (clientX <= this.shiftX) {
				this.lThumbX = 0;
			} else if (relPosX<=this.lThumbStartX - this.shiftX) {
				this.lThumbX = 0;

				console.log('zero',relPosX,this.lThumbStartX - this.shiftX);

			} else if (relPosX >= this.rThumbX) {
				this.lThumbX = this.rThumbX;// - this.tWidth;

				console.log('more than rThumbX',this.rThumbX);

			} else {
				this.lThumbX = relPosX;

			}
			this.lThumb.style.left = this.toPercent(this.lThumbX) + '%';
		} else {

			if (relPosX <= this.lThumbX) {
				this.rThumbX = this.lThumbX;// - this.tWidth;
			} else if (relPosX >= this.rThumbStartX - this.shiftX) {
				this.rThumbX = this.rThumbStartX - this.shiftX;// - this.tWidth;

			} else {
				this.rThumbX = relPosX;
			}

			this.rThumb.style.left = this.toPercent(this.rThumbX) + '%';
		}
		
		obj.style.top = pageY  + 'px';		

			this.updateRange(this.lThumbX,this.rThumbX);
			this.pBar.style.left = this.toPercent(this.lThumbX) + '%';

			this.pBar.style.right = 100 - this.toPercent(this.rThumbX) + '%';
	}
	
	updateRange(minPos, maxPos) {

		const numRange = this.max - this.min;

		const pixRange = this.sliderWidth;

		const unit = pixRange / numRange;

		const newMin = Math.floor(minPos / unit + this.min);

		const newMax = Math.floor(maxPos / unit + this.min);

		const from = this.element.querySelector('[data-element="from"]');

		from.textContent = `${this.formatValue(newMin)}`;
		const to = this.element.querySelector('[data-element="to"]');
		to.textContent = `${this.formatValue(newMax)}`;

	}
	
	setSelected(selFrom,selTo){
		//обновляем позиции тумблеров и устанавливаем граничные значения по переданным параметрам (Число)
		
		const numRange = this.max - this.min;
		console.log(numRange);
		const pixRange = this.sliderWidth;
		console.log(pixRange);
		const unit = pixRange / numRange;

		this.lThumb.style.left = this.toPercent((selFrom - this.min) * unit) + '%';
		this.rThumb.style.left = this.toPercent((selTo - this.min) * unit) + '%';
		this.lThumbX = ((selFrom - this.min) * unit);
		this.rThumbX = ((selTo - this.min) * unit);
		this.pBar.style.left = this.toPercent(this.lThumbX) + '%';
		this.pBar.style.right = 100 - this.toPercent(this.rThumbX) + '%';

		const from = this.element.querySelector('[data-element="from"]');
		from.textContent = this.formatValue(selFrom);

		const to = this.element.querySelector('[data-element="to"]');
		to.textContent = this.formatValue(selTo);

	}
	
	onPointerMove (obj, event) {

		this.moveAt(obj, event.clientX, this.yPos);

	}
	
	onPointerUp(event) {

		document.removeEventListener('pointerup', this.onPointerUpBind);
		document.removeEventListener('pointermove',this.onPointerMoveBind);

		this.element.dispatchEvent(new CustomEvent("range-select", {
			bubles: true,
			cancelable: true
		  }));
	}
	
	onPointerDown (obj, event) {
		
		this.onPointerMoveBind=this.onPointerMove.bind(this,obj);
		this.onPointerUpBind=this.onPointerUp.bind(this);		
		
		document.addEventListener('pointermove',this.onPointerMoveBind);
		document.addEventListener('pointerup', this.onPointerUpBind);

	}
	
	
	addListeners(slider) {
		
		this.lThumb.addEventListener('pointerdown',this.onPointerDown.bind(this,this.lThumb));
		this.rThumb.addEventListener('pointerdown',this.onPointerDown.bind(this,this.rThumb));

	}
	
	removeListeners (slider) {
		this.lThumb.removeEventListener('pointerdown',this.onPointerDown.bind(this,this.lThumb));
		this.rThumb.removeEventListener('pointerdown',this.onPointerDown.bind(this,this.rThumb));		
	}
	
	toPercent(val) {
		return (val / this.sliderWidth) * 100;
	}
	
	setThumbPosition(thumb, val) {
	  const percent = this.toPercent(val);
	  thumb.style.left = `${percent}%`; 
	}	
}

*/