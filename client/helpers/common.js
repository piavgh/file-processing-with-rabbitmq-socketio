export const arrayEqual = (arr1, arr2) => {
  let result = true;
  if(arr1.length == arr2.length) {
    arr1.every((el, index) => {
      if(arr2[index] != el) {
        result = false;
        return false;
      }
      return true;
    });
  } else {
    result = false;
  }
  return result;
}