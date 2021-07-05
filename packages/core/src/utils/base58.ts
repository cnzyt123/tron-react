/**
 * Base58 encoding/decoding
 *
 * Originally written by Mike Hearn for BitcoinJ
 * Copyright (c) 2011 Google Inc
 * Ported to JavaScript by Stefan Thomas
 * Merged Buffer refactorings from base58-native by Stephen Pair
 * Copyright (c) 2013 BitPay Inc
 * 
 * https://github.com/ognus/wallet-address-validator/blob/master/src/crypto/base58.js
 *
 * created by keng42 @2020-07-21 17:06:04
 */

 const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
 const ALPHABET_MAP: { [key: string]: number } = {};
 for (let i = 0; i < ALPHABET.length; ++i) {
   ALPHABET_MAP[ALPHABET.charAt(i)] = i;
 }
 const BASE = ALPHABET.length;
 
 export function decodeBase58(str: string): number[] {
   if (str.length === 0) return [];
 
   let i, j;
   const bytes = [0];
   for (i = 0; i < str.length; ++i) {
     const c = str[i];
     if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character');
 
     for (j = 0; j < bytes.length; ++j) bytes[j] *= BASE;
     bytes[0] += ALPHABET_MAP[c];
 
     let carry = 0;
     for (j = 0; j < bytes.length; ++j) {
       bytes[j] += carry;
       carry = bytes[j] >> 8;
       bytes[j] &= 0xff;
     }
 
     while (carry) {
       bytes.push(carry & 0xff);
       carry >>= 8;
     }
   }
   // deal with leading zeros
   for (i = 0; str[i] === '1' && i < str.length - 1; ++i) {
     bytes.push(0);
   }
 
   return bytes.reverse();
 }