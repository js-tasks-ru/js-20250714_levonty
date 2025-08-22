export default class SortableTable {
  constructor(headerConfig = [], { 
	data = [], 
	sorted = {}
	} = {}) {
    this.header = headerConfig;
    this.data = data;
	this.sorted = sorted;	
	this.isSortLocally = true;

    this.element = this.createTableElement();
    this.subElements = {
      body: this.element.querySelector('[data-element="body"]'),
      header: this.element.querySelector('[data-element="header"]')
    };	

	if (this.sorted['id'] && this.sorted['order']) this.setSorting({id: this.sorted['id'], order: this.sorted['order']});

	this.handleTheaderClick = this.handleTheaderClick.bind(this);
	this.subElements.header.addEventListener('pointerdown',this.handleTheaderClick); //*
	
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
	  	  
	  this.sort(id, order); 
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
	
  sort(field, order) {
	  
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
  
  destroy() {
	  this.subElements.header.removeEventListener('pointerdown',this.handleTheaderClick);
	  this.element.remove();
  }
  
}

