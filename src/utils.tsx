export function formatAddress(address: string) {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
}

export const padWidth = "1024px";

/**
 * Convert an image 
 * to a base64 url
 * @param  {String}   url    
 * @param  {String}   [outputFormat=image/png]         
 * @param  {Function} callback           
 */
 export function convertImgToBase64URL(url: string, outputFormat: any, callback: (arg0: any) => void){
  var img = new Image();
  img.setAttribute('crossOrigin','Anonymous');
  img.onload = () => {
      var canvas = document.createElement('CANVAS') as any,
      ctx = canvas.getContext('2d'), dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
      } else {
        dataURL = null;
      }
      callback(dataURL);
      canvas = null;
  };
  img.src = url + '?time=' + new Date().valueOf();
}
