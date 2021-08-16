function dec2hex (dec) {
    return dec.toString(16).padStart(2, "0")
  }
  
  // generateId :: Integer -> String
 export const generateId  = (len) => {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
  }
  
 export const filter_chat = async (arr) => {

      await arr.sort(function(a, b) {
          var keyA = new Date(a.timestamp),
            keyB = new Date(b.timestamp);
          // Compare the 2 dates
          if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0;
        });
        return arr;
}