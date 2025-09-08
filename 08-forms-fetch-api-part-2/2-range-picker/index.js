export default class RangePicker {
	constructor ({from, to}={}) {

		this.from = from;
		this.from.setHours(0,0,0,0);
		this.leftCalendarStart = new Date (this.from.getFullYear(), this.from.getMonth(),1,0,0,0,0);
		this.to = to;
		this.to.setHours(0,0,0,0);
		this.rightCalendarStart = new Date (this.from.getFullYear(), this.from.getMonth()+1,1,0,0,0,0);

		this.element = this.createCalendarElement();
		this.handlePickerClick = this.handlePickerClick.bind(this);
		this.handleSelectorClick = this.handleSelectorClick.bind(this);
		this.handlePrevMonthClick = this.handlePrevMonthClick.bind(this);
		this.handleNextMonthClick = this.handleNextMonthClick.bind(this);
		this.clickOutsideCalendar = this.clickOutsideCalendar.bind(this);
		this.addListeners();

	}
	
	
	calendarTpl(){
		return `
			<div class="rangepicker">
				<div class="rangepicker__input" data-element="input">
					${this.rangeSelectorElement()}	
				</div>
				<div class="rangepicker__selector" data-element="selector"></div>
			</div>		
		`;
					
	}
	
	calendarHeaderElement(){
		//верхняя часть: переход по месяцам

		return `
			<div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
			<div class="rangepicker__calendar">${this.calendarPanelElement(this.leftCalendarStart)}</div>	
			<div class="rangepicker__calendar">${this.calendarPanelElement(this.rightCalendarStart)}</div>				
		`;
	}
	
	getMonthTxt(dateObj) {
		return dateObj.toLocaleString('default',{month: 'long'});
	}
	
	calendarDaysElement(dateObj) {

		let year = dateObj.getFullYear();
		let month = dateObj.getMonth();

		let firstDayStyle = '';
		let selectedClass = '';
		let firstDayShift = new Date(year, month).getDay();
		firstDayShift === 0 ?	firstDayShift = 7 : firstDayShift++;
		let btns = '';
		for (let i=1; i<= new Date(year, month+1, 0).getDate(); i++) {
			if (i==1) {
				firstDayStyle = `style="--start-from: ${firstDayShift}"`;
			} else {
				firstDayStyle = '';	
			}
			let tmpDate = new Date(year,month,i);
			tmpDate.setHours(0,0,0,0);

			if (tmpDate.getTime() == this.from.getTime()) {
				selectedClass = 'rangepicker__selected-from';
			} else if (this.to && tmpDate.getTime()>this.from.getTime() && tmpDate.getTime()<this.to.getTime()) {
				selectedClass = 'rangepicker__selected-between';
			} else if (this.to && tmpDate.getTime() == this.to.getTime()) {
				selectedClass = 'rangepicker__selected-to';
			} else {
				selectedClass = '';
			}
			
			btns += `<button type="button" class="rangepicker__cell ${selectedClass}" ${firstDayStyle} data-value="${new Date(Date.UTC(year,month,i,0)).toISOString()}">${i}</button>`;

		}
		
		return btns;

	}
	

	
	calendarPanelElement(dateObj) {
		return `
        <div class="rangepicker__month-indicator">
          <time datetime="${this.getMonthTxt(dateObj)}">${this.getMonthTxt(dateObj)}</time>
        </div>	
        <div class="rangepicker__day-of-week">
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
        <div class="rangepicker__date-grid">
					${this.calendarDaysElement(dateObj)}	
        </div>
		`;
	}
	
	formatDateToTxt(dateObj) {

		const year = dateObj.getFullYear();
		let month = dateObj.getMonth()+1;
		let day = dateObj.getDate();
		
		if (day < 10) day = '0' + day;
		if (month < 10) month = '0' + month;

		return `${day}.${month}.${year}`;
		
	}

	rangeSelectorElement() {
		
		return `
							<span data-element="from">${this.formatDateToTxt(this.from)}</span> -
							<span data-element="to">${this.formatDateToTxt(this.to)}</span>`;
	}
	
	createCalendarElement(){
		const div = document.createElement('div');
		div.innerHTML = this.calendarTpl();
		return div.firstElementChild;
	}
	
	addListeners() {
		const picker = this.element.querySelector('[data-element="input"]');
		picker.addEventListener('click',this.handlePickerClick);
		const selector = this.element.querySelector('[data-element="selector"]');
		selector.addEventListener('click',this.handleSelectorClick);	
	
	}
	
	addMonthListeners() {
		const prevMonth = this.element.querySelector(".rangepicker__selector-control-left");
		prevMonth.addEventListener('click',this.handlePrevMonthClick);		
		const nextMonth = this.element.querySelector(".rangepicker__selector-control-right");
		nextMonth.addEventListener('click',this.handleNextMonthClick);	
		document.addEventListener('click',this.clickOutsideCalendar);
	}
	
	removeMonthListeners() {
		const prevMonth = this.element.querySelector(".rangepicker__selector-control-left");
		prevMonth.removeEventListener('click',this.handlePrevMonthClick);		
		const nextMonth = this.element.querySelector(".rangepicker__selector-control-right");
		nextMonth.removeEventListener('click',this.handleNextMonthClick);	
		document.removeEventListener('click',this.clickOutsideCalendar);
	}	
	
	clickOutsideCalendar(event) {

	if (!this.element.contains(event.target)) {
			//let calendar = document.querySelector('.rangepicker');
			//calendar.classList.remove('rangepicker_open');
			this.element.classList.remove('rangepicker_open');
			this.removeMonthListeners();
		}
	}
	
	handlePrevMonthClick(){

		this.rightCalendarStart = new Date(this.leftCalendarStart);
		this.leftCalendarStart = new Date(this.rightCalendarStart.getFullYear(),this.rightCalendarStart.getMonth()-1,1,0,0,0,0);
		
		const calendars = this.element.querySelectorAll('.rangepicker__calendar');
		const leftCalendar = calendars[0];
		const rightCalendar = calendars[1];
		leftCalendar.innerHTML = this.calendarPanelElement(this.leftCalendarStart);
		rightCalendar.innerHTML = this.calendarPanelElement(this.rightCalendarStart);
	}
	
	handleNextMonthClick() {
		
		this.leftCalendarStart = new Date(this.rightCalendarStart);
		this.rightCalendarStart = new Date(this.rightCalendarStart.getFullYear(),this.rightCalendarStart.getMonth()+1,1,0,0,0,0);
			
		const calendars = this.element.querySelectorAll('.rangepicker__calendar');
		const leftCalendar = calendars[0];
		const rightCalendar = calendars[1];
		leftCalendar.innerHTML = this.calendarPanelElement(this.leftCalendarStart);
		rightCalendar.innerHTML = this.calendarPanelElement(this.rightCalendarStart);		
	}
	
	
	
	handlePickerClick() {

		const selector = this.element.querySelector('[data-element="selector"]');
		if (selector.childNodes.length===0) { 
			selector.innerHTML = this.calendarHeaderElement();
		}
		if (this.element.classList.contains('rangepicker_open')) {
			this.removeMonthListeners();
			this.element.classList.remove('rangepicker_open');
		} else {
			this.element.classList.add('rangepicker_open');
			this.addMonthListeners();
		}
				
	}
	
	clearCalendar() {
		const start = this.element.querySelector('.rangepicker__selected-from');
		if (start) start.classList.remove('rangepicker__selected-from');
		const finish = this.element.querySelector('.rangepicker__selected-to');
		if (finish) finish.classList.remove('rangepicker__selected-to');
		const between = this.element.querySelectorAll('.rangepicker__selected-between');
		if (between) {
			Array.from(between).forEach(item=>item.classList.remove('rangepicker__selected-between'));
		}
	}

	handleSelectorClick(event) {

		const btn = event.target.closest('.rangepicker__cell');
		if (!btn) return;

		const clickedDate = new Date(btn.dataset.value);
    clickedDate.setHours(0,0,0,0);			

		if (this.to!==null) {
			this.clearCalendar();
			btn.classList.toggle('rangepicker__selected-from');
			this.from = clickedDate;
			this.to = null;

		} else {

			this.to = clickedDate;
			this.clearCalendar();

			if (this.from.getTime()>this.to.getTime()) {
				[this.from,this.to] = [this.to,this.from];
			} 
				const selected = this.element.querySelectorAll('.rangepicker__cell');
				Array.from(selected).forEach(item=>{
					const tmpDate = new Date (item.dataset.value);
					tmpDate.setHours(0,0,0,0);
					if (tmpDate > this.from && tmpDate < this.to) item.classList.toggle('rangepicker__selected-between');
					if (tmpDate.getTime() - this.from.getTime()===0) item.classList.toggle('rangepicker__selected-from');
					if (tmpDate.getTime() - this.to.getTime()===0) item.classList.toggle('rangepicker__selected-to'); 
				});


			const from = this.element.querySelector('[data-element="from"]');
			from.textContent = this.formatDateToTxt(this.from);
			const to = this.element.querySelector('[data-element="to"]');
			to.textContent = this.formatDateToTxt(this.to);
			this.element.classList.remove('rangepicker_open');
			
			this.element.dispatchEvent(new CustomEvent('date-select',{
				bubbles: true,
				cancelable: true,
				detail: {
					from: this.from,
					to: this.to
				}
			}));
			
		}

	}
	
	destroy() {
	  this.remove();
	}
		
	remove() {
	  this.element.remove();
	}
}


