export default class SortableTable {
  constructor(headerConfig = [], data = []) {
	this.headerConfig = headerConfig;
	this.data = data;
	this.element = this.createTable();

  }
  
  createTableHeader() {
	  let headerRow = this.headerConfig.map(item => (`<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
        <span>${item.title}</span>
      </div>`)).join('');
	  let headerRowWrapper = `<div data-element="header" class="sortable-table__header sortable-table__row">${headerRow}</div>`;
	  return headerRowWrapper;
  }
  
  createTable() {
		const tableWrapper = `<div data-element="productsContainer" class="products-list__container">
								<div class="sortable-table">
									${this.createTableHeader()}
									${this.createTableBody()}
									
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
  
  createTableBody() {

	  let tableRows = (this.data).map(item => (`<a href="#" class="sortable-table__row">
        <div class="sortable-table__cell">
  <img class="sortable-table-image" alt="Image" src="${item['images']?.[0]['url']||'https://via.placeholder.com/32'}"></div>
        <div class="sortable-table__cell">${item['title']}</div>

        <div class="sortable-table__cell">${item['quantity']}</div>
        <div class="sortable-table__cell">${item['price']}</div>
        <div class="sortable-table__cell">${item['sales']}</div>
      </a>`)).join('');
	  const tableBodyWrapper = `<div data-element="body" class="sortable-table__body">${tableRows}</div>`;

		return tableBodyWrapper;
  }
  
  destroy() {
	  this.element.remove();
  }
  
  sort(field, order) {
	  let sortType = null;
	  let sorted;
	  let sortDir = order=='asc' ? 1 : -1;

	  for (let obj of this.headerConfig) {
		  if (obj['id']==field) {
			  //if(obj['sortType']=='string') console.log('Will be sorted as string');
			  //if(obj['sortType']=='number') console.log('Will be sorted as number');
			  sortType = obj['sortType'];
			  if (sortType == 'number') {
				  this.data.sort((rowA, rowB)=>sortDir * (Number(rowA[field])-Number(rowB[field])));
			  } else if (sortType == 'string') {
				 this.data.sort((rowA, rowB)=>sortDir * (rowA[field].localeCompare(rowB[field], ["ru", "en"], 
					  { 
						sensitivity: "case", // Учитывать регистр
						caseFirst: "upper",  // Сначала заглавные буквы
						numeric: true        // Для числовых строк (опционально)
					  }))); 
			  }
			  break;
		  }
	  }
	  
	  //console.log(this.data);
	  console.log(this.createTableBody());

	  let tblBody = document.querySelector('[data-element="body"]');
	  tblBody.remove();
	  //tblBody.innerHTML = this.createTableBody();

	  
	  let newTblBody = document.createElement('newTblBody');
	  newTblBody.innerHTML = this.createTableBody();
	  
	  let tblHeader = document.querySelector('[data-element="header"]');
	  tblHeader.after(newTblBody.firstElementChild);
	  
	  this.subElements = {
		body: this.element.querySelector('[data-element="body"]')
	  };
  //*this.subElements.body.innerHTML = this.createTableBody();
  
 // return this.element;
	  
			
  }
}

