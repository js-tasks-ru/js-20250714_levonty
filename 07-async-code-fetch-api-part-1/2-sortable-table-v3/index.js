import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  constructor(headersConfig = [], { 
		sorted = {},
		url = '',	
		isSortLocally = false,
		} = {}) {
    
		this.header = headersConfig;

		this.sorted = sorted;	
		this.isSortLocally = isSortLocally;
		this.url = url;
		this.records = 30;
		this.start = 0;
		this.end = this.records;
		this.hasMore = true;
		this.scrollWait = false;
	
	
		this.element = this.createLoadingElement();
		this.subElements = {
			body: null,
			header: null
		};	
		this.handleTheaderClick = this.handleTheaderClick.bind(this);
		this.handleScrollBind = this.handleScroll.bind(this);
		this.initial = this.init();
	
  }
	
  createLoadingElement() {
	  const loading = document.createElement('div');
	  loading.innerHTML = '<p>LOADING!</p>';
	  return loading.firstElementChild;
  }	
	
	
	
	async init(){
		
		try {
			this.data = await this.loadData();
			this.element.innerHTML = '';
			this.element.append(this.createTableElement());
			await Promise.resolve();

			this.subElements = {
				body: this.element.querySelector('[data-element="body"]'),
				header: this.element.querySelector('[data-element="header"]')
			};
			this.subElements.header.addEventListener('pointerdown',this.handleTheaderClick);
			document.addEventListener('scroll',this.handleScrollBind);

			} catch (e) {
				console.log('init err',e);
			}
	}	
	
	async handleScroll(){
		
		let newPageHeight;
		
		if (this.scrollWait) return;
		
		let pageHeight = Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight
		);
		let curScroll = window.scrollY;
		let pageBottom = pageHeight - document.documentElement.clientHeight - curScroll;
		if (pageBottom<=50) {

					if (!this.hasMore) return; 
					this.scrollWait = true;

					pageHeight = Math.max(
								document.body.scrollHeight, document.documentElement.scrollHeight,
								document.body.offsetHeight, document.documentElement.offsetHeight,
								document.body.clientHeight, document.documentElement.clientHeight
							);	
					curScroll = window.scrollY;

										
					const newData = await this.loadData(this.end,this.end+this.records);
					
					if (newData.length < this.records) {
						this.hasMore = false; 
					}
					
					if (newData.length===0) return;
		
					this.data.push ( ...newData);

					this.start = this.end;
					this.end+= this.records;
					
			
					
					// Обновляем таблицу
					await this.render();
					setTimeout(()=>{
					newPageHeight = Math.max(
						document.body.scrollHeight, document.documentElement.scrollHeight,
						document.body.offsetHeight, document.documentElement.offsetHeight,
						document.body.clientHeight, document.documentElement.clientHeight
					);
					const heightDiff = newPageHeight - pageHeight;

					},0);


		}
	}
	
	async loadData(start=this.start,end=this.end) {
		
		try {
			const url = BACKEND_URL + '/' + this.url +  '?_embed=subcategory.category&_sort='+this.sorted['id']+'&_order='+this.sorted['order']+'&_start='+start+'&_end='+end;

			const response = await fetch(url);
			const json = await response.json();
			return json;
		} catch (e) {
			console.log(e);
			return [];
		}
  }
	
	async render() {

		await this.initial;
		this.data = await this.loadData(this.start, this.end);
	  const oldTableBody = this.subElements.body;
	  oldTableBody.innerHTML = this.createTableBodyElement();
  }	
  
  handleTheaderClick(event) {
	  const sortParams = this.defineSortColumn(event);
	  if (sortParams) {
			this.setSorting(sortParams);
	  }
  }
  
  defineSortColumn(event){

	  const headerCell = event.target.closest('.sortable-table__cell');
	  if (!headerCell) return;
	  if (headerCell.dataset.sortable!=='true') return {};

	  
	  const order = headerCell.dataset.order ===  'desc' ? 'asc' : 'desc';
	  headerCell.dataset.order = order;
	  
		return {
			id: headerCell.dataset.id, 
			order
		}
  }
  
 setSorting = ({id, order}) => {

	 if (!id || !order) return

	 const headerCell = this.subElements.header.querySelector(`[data-id="${id}"]`); 

	 if (!headerCell) return;
	 if (headerCell.dataset.sortable!='true') return;
	  
	  const arrow = this.subElements.header.querySelector('.sortable-table__sort-arrow');
	  if (arrow) arrow.remove();
	  const arrowElement = document.createElement('span');
	  arrowElement.innerHTML = `<span class="sort-arrow"></span>`;
		arrowElement.className = 'sortable-table__sort-arrow';
		arrowElement.dataset.element = 'arrow';


	  headerCell.append(arrowElement);

		if (this.isSortLocally === true) {
			this.sortOnClient(id, order);
		} else {
			this.sortOnServer(id, order);
		}		
	  headerCell.dataset.order =  order;
 }
 

	
  createTableHeaderElement() {

	  const headerRow = this.header.map(item => (`<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="">
        <span>${item.title}</span>
      </div>`)).join('');
	  return `<div data-element="header" class="sortable-table__header sortable-table__row">${headerRow}</div>`;
  }
  
  
  createTableBodyElement() {
	  const tableBody = this.data.map(item => this.createRowElement(item)).join('');
	  return tableBody;
  }
  
  
  
  createRowElement(item) {
	  
    const row = this.header.map(col => this.createCellElement(item, col)).join('');
    return `<a href="#" class="sortable-table__row">${row}</a>`;
  }

  
  createCellElement(item, column) {
		
    if (typeof item[column['id']] === 'object') {return `
          <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="${this.data[0]?.url || 'https://via.placeholder.com/32'}">
          </div>
        `;}
    return `<div class="sortable-table__cell">${item[column['id']]}</div>`;
  }
  
  createTableElement() {
		
    const tableWrapper = `<div data-element="productsContainer" class="products-list__container">
								<div class="sortable-table">
									${this.createTableHeaderElement()}
									<div data-element="body" class="sortable-table__body">${this.createTableBodyElement()}</div>
									
									<div data-element="loading" class="loading-line sortable-table__loading-line"></div>

									<div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
									  <div>
										<p>No products satisfies your filter criteria</p>
										<button type="button" class="button-primary-outline">Reset all filters</button>
									  </div>
									</div>	
								</div>
							</div>`;
    const table = document.createElement('tbl');
			
    table.innerHTML = tableWrapper;
    return table.firstElementChild;		
		
  }
	
  sortOnClient(field, order) {
	  
	  let sortType = null;
	  let sorted;
	  let sortDir = order === 'asc' ? 1 : -1;

	  for (let obj of this.header) {
		  if (obj['id'] == field) {

			  sortType = obj['sortType'];
			  if (sortType == 'number') {
				  this.data.sort((rowA, rowB)=>sortDir * (Number(rowA[field]) - Number(rowB[field])));
			  } else if (sortType === 'string') {
				 this.data.sort(
					(rowA, rowB)=> { 
						let compare = String(rowA[field]).localeCompare(String(rowB[field]), 
							["ru", "en"], 
							{ sensitivity: "variant" }
						);
						return sortDir===1 ? compare: -compare;
					}
				);
				
			  }
			  break;
		  }
	  }
	  
		const oldTableBody = this.subElements.body;
	  
	  oldTableBody.innerHTML = this.createTableBodyElement();
	  
  }	
  
  async sortOnServer (id, order) {
		try {
				this.sorted['id']=id;
				this.sorted['order']=order;
				this.data = await this.loadData();
				//await this.render();
				const oldTableBody = this.subElements.body;
				oldTableBody.innerHTML = this.createTableBodyElement();
			} catch (e) {
				console.log(e)
			}
  }	
	
  destroy() {
		
		  try {
				if (this.subElements?.header) {
					this.subElements.header.removeEventListener('pointerdown', this.handleTheaderClick);
				}
			} catch (error) {
				console.warn('Error removing event listener:', error);
			}
			
			try {
				this.element?.remove();
			} catch (error) {
				console.warn('Error removing element:', error);
			}			
	}
	
}

