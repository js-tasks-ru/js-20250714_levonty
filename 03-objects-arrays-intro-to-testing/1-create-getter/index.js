/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
	return function(obj) {
		const pathArr = path.split('.');
		const lastKey = pathArr.pop();
		let lastObj = pathArr.reduce((acc,index)=>{
			if (acc.hasOwnProperty(index)) {
				return acc[index];
			} else {
				return false;
			}
		
		},obj);
		
		if (lastObj) {
			if (lastObj.hasOwnProperty(lastKey)) {
				return lastObj[lastKey];
			} 
		}
		return;
	}
}
