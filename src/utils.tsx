export function formatAddress(address: string) {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
}

export const padWidth = "1024px";

/**
 * 通过 rawHTML 获取所有 img 中的 src
 * @param rawHTML 
 * @returns 
 */
export function getImgSrcs(rawHTML: string) {
  var patt = /<img\s.*?src=(?:'|")([^'">]+)(?:'|")/gi;
  var result = [], temp;
  while((temp = patt.exec(rawHTML)) != null ) {
    result.push(temp[1]);
  }
  return result;
}

/**
 * 获取可安全下载的图片地址
 * @param src
 */
export const getDownloadSafeImgSrc = (src: string): Promise<string> => {
  return new Promise(resolve => {
    // 0. 无效 src 直接返回
    if (!src) {
      resolve(src);
    }

    // 1. 同域或 base64 形式 src 直接返回
    if (isValidDataUrl(src) || isSameOrigin(src)) {
      console.log(' 同域或 base64 形式 src 直接返回', src);
      resolve(src);
    }

    // 2. 跨域图片转 base64 返回
    console.log(' 跨域图片 ', src);
    getImgToBase64(src, resolve);
  });
};

/**
 * 判断给定 URL 是否为 Data URLs
 * @param s
 */
export const isValidDataUrl = (s: string): boolean => {
  const rg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
  return rg.test(s);
};

/**
 * 判断给定 URL 是否与当前页面同源
 * @param s
 */
export const isSameOrigin = (s: string): boolean => {
  return s.includes(location.origin)
}

/**
 * 根据资源链接地址获取 MIME 类型 (如果不考虑 webp 以及 icon 等格式)
 * 默认返回 'image/jpeg'
 * @param src
 */
export const getImgMIMEType = (src: string): string => {
  const JPEG_MIME = 'image/jpeg';

  // 找到文件后缀
  let type = src.replace(/.+\./, '').toLowerCase();

  // 处理特殊各种对应 MIME 关系
  type = type.replace(/jpg/i, 'jpeg').replace(/svg/i, 'svg+xml');

  if (!type) {
    return JPEG_MIME;
  } else {
      const matchedFix = type.match(/png|jpeg|bmp|gif|svg\+xml/);
    return matchedFix ? `image/${matchedFix[0]}` : JPEG_MIME;
  }
};

export const convertBlobToBase64 = async (blob: Blob) => { // blob data
  return await blobToBase64(blob);
}

export const blobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});


/**
 * getImgToBase64
 * @param url 
 * @param callback 
 * @param mime 
 */
function getImgToBase64(url: string, callback: Function, mime?: string) {
  // canvas 画布
  let canvas = document.createElement('CANVAS') as any,
  ctx = canvas.getContext('2d'),
  img = new Image();
  img.setAttribute('crossOrigin','Anonymous');
  img.onload = function() {
    canvas.height = img.height;
    canvas.width = img.width;

    // 绘制
    ctx!.drawImage(img, 0, 0);

    // 生成 Data URL
    // const dataURL = canvas.toDataURL(mime || 'image/png');
    // console.log('getImgToBase64 = ', dataURL);
    canvas.toBlob(async function(blob: Blob){
      const base64str = await convertBlobToBase64(blob);
      if (base64str) {
        console.log('canvas base64str');
        callback(base64str);
      }
    }, "image/jpeg", 0.95); // JPEG at 95% quality
    
    canvas = null;
  };
  
  if (/http[s]{0,1}/.test(url)) {
    // 解决跨域问题
    img.src = url + '?random=' + Date.now();
  } else {
    img.src = url;
  }
}