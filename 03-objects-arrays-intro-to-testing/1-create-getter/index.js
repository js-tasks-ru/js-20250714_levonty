/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return function(obj) {
    const pathArr = path.split('.');

    for (const key of pathArr) {
      if (key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (obj.hasOwnProperty(key)) {
            obj = obj[key];
            continue;
          } 
        } else {
          if (obj.hasOwnProperty(key)) {return obj[key];}
        }
      } 
    }
  };
}
