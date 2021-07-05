/**
 * Hex encoding/decoding
 *
 * Originally written by:
 * https://github.com/christsim/multicoin-address-validator/blob/master/src/crypto/utils.js
 *
 * created by keng42 @2020-07-21 17:06:04
 */

 function isHexChar(c: string) {
    if (
      (c >= 'A' && c <= 'F') ||
      (c >= 'a' && c <= 'f') ||
      (c >= '0' && c <= '9')
    ) {
      return 1;
    }
    return 0;
  }
  
  /* Convert a hex char to value */
  function hexChar2byte(c: string) {
    let d = 0;
    if (c >= 'A' && c <= 'F') {
      d = c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    } else if (c >= 'a' && c <= 'f') {
      d = c.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
    } else if (c >= '0' && c <= '9') {
      d = c.charCodeAt(0) - '0'.charCodeAt(0);
    }
    return d;
  }
  
  /* Convert a byte to string */
  function byte2hexStr(b: number) {
    const hexByteMap = '0123456789ABCDEF';
    let str = '';
    str += hexByteMap.charAt(b >> 4);
    str += hexByteMap.charAt(b & 0x0f);
    return str;
  }
  
  export function byteArray2hexStr(byteArray: number[]): string {
    let str = '';
    let i = 0;
    for (; i < byteArray.length - 1; i++) {
      str += byte2hexStr(byteArray[i]);
    }
    str += byte2hexStr(byteArray[i]);
    return str;
  }
  
  export function hexStr2byteArray(str: string): number[] {
    const byteArray = [];
    let d = 0;
    let i = 0;
    let j = 0;
    let k = 0;
  
    for (i = 0; i < str.length; i++) {
      const c = str.charAt(i);
      if (isHexChar(c)) {
        d <<= 4;
        d += hexChar2byte(c);
        j++;
        if (0 === j % 2) {
          byteArray[k++] = d;
          d = 0;
        }
      }
    }
    return byteArray;
  }