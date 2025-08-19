import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
	element;
	chartHeight = 50;
	
	constructor (props = {}) {
		
		
	  const {
	    data = [], 
	    label = '', 
	    value = 0, 
	    link = '',
		url = '',
		range = {},
	    formatHeading = (value)=> value,
	  } = props;
		

	  this.data = data;
	  this.label = label;
	  this.value = value;
	  this.link = link;
	  this.formatHeading = formatHeading;
	  this.url = url;
	  this.from = range['from'];
	  this.to = range['to'];
		
		
	  this.element = this.createElement();
		this.subElements = {
			  body: this.element.querySelector('[data-element="body"]'),
			  header: this.element.querySelector('[data-element="header"]')
			};	  
	  
	  
		
	}
	
	createTemplate() {
	  return `
				<div class="column-chart" style="--chart-height: 50">
					  <div class="column-chart__title">
						${this.label}
						${this.createTemplateLink()}
					  </div>
					  <div class="column-chart__container">
						<div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
						<div data-element="body" class="column-chart__chart">
							${this.createChartTemplate()}
						</div>
					  </div>
					</div>			
			`;
	}
		
	createTemplateLink() {
	  if (this.link) {
	    return `<a class="column-chart__link" href="${this.link}">View all</a>`;
	  }
	  return '';
	}
		
	createChartTemplate() {
	  return this.getColumnProps(this.data).map(({value, percent})=>(`<div style="--value: ${value}" data-tooltip="${percent}"></div>`)).join('');
	}

	getColumnProps(data) {
		  const maxValue = Math.max(...data);
		  const scale = 50 / maxValue;

		  return data.map(item => {
	    return {
			  percent: (item / maxValue * 100).toFixed(0) + '%',
			  value: String(Math.floor(item * scale))
	    };
		  });
	}		
		
	createElement() {
	  const element = document.createElement('div');
			
	  element.innerHTML = this.createTemplate();
	  const firstElementChild = element.firstElementChild;
			
	  if(this.data.length==0) firstElementChild.classList.add('column-chart_loading');
			
	  return firstElementChild;
	}

	destroy() {
	  this.remove();
	}
		
	remove() {
	  this.element.remove();
	}
	
	
	async update (fromDate, toDate) {
		
		try {
			let response = await fetch(BACKEND_URL + '/' + this.url + '?from=' + fromDate + '&to=' + toDate );
			let data = await response.json();

			this.data = Object.values(data);

			this.subElements.body.innerHTML = this.createChartTemplate();

			if (this.data.length === 0) {
				this.element.classList.add('column-chart_loading');
			} else {
				this.element.classList.remove('column-chart_loading');
			}	

			this.subElements.header.textContent = this.data.reduce((acc, val) => acc + val, 0);

			return data;
		} catch (err) {
			console.log(err);
		}
	}
	
}
