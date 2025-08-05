/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (!string) {return '';}
  if (+size === 0) {return '';}	
  if (size === undefined) {return string;}
	
  let curSymb = string[0];
  let curSymbCount = 1;
  let newStr = curSymb;
  for (let i = 1; i < string.length; i++) {
    if (curSymb != string[i]) {
      curSymb = string[i];
      curSymbCount = 1;
      newStr += string[i];
    } else {
      if (curSymbCount < size) { 
        curSymbCount++;
        newStr += string[i];
      } 
    }
  }
  return newStr;
}
