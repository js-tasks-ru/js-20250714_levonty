/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
	if((typeof obj)!='object') return;
	if (!Object.keys(obj).length) return {};
	const newObj = Object.fromEntries(
		Object.entries(obj).map(([key,value])=>[value,key])
	);
	return newObj;
}
