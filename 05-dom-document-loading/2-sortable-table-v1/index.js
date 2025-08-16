export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.header = headerConfig;
    this.data = data;
    this.element = this.createTableElement();
    this.subElements = {
      body: this.element.querySelector('[data-element="body"]'),
      header: this.element.querySelector('[data-element="header"]')
    };

  }
 
  createTableHeaderElement() {
	  const headerRow = this.header.map(item => (`<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
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
	  let sortDir = order == 'asc' ? 1 : -1;

	  for (let obj of this.header) {
		  if (obj['id'] == field) {

			  sortType = obj['sortType'];
			  if (sortType == 'number') {
				  this.data.sort((rowA, rowB)=>sortDir * (Number(rowA[field]) - Number(rowB[field])));
			  } else if (sortType == 'string') {
				 this.data.sort((rowA, rowB)=>sortDir * (rowA[field].localeCompare(rowB[field], ["ru", "en"], 
					  { 
              sensitivity: "case", // Учитывать регистр
              caseFirst: "upper", // Сначала заглавные буквы
              numeric: true // Для числовых строк (опционально)
					  }))); 
			  }
			  break;
		  }
	  }
	  

	  const oldTableBody = document.querySelector('[data-element="body"]');
	  oldTableBody.innerHTML = this.createTableBodyElement();
	  
  }	
  
  destroy() {
	  this.element.remove();
  }
  
}

