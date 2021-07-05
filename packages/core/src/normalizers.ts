import { decodeBase58 } from './base58'
import { byteArray2hexStr, hexStr2byteArray } from './hex'
import jsSHA from 'jssha'
import invariant from 'tiny-invariant'


export function normalizeChainId(chainId: string | number): number {
  if (typeof chainId === 'string') {

    
    // Temporary fix until the next version of Metamask Mobile gets released.
    // In the current version (0.2.13), the chainId starts with “Ox” rather
    // than “0x”. Fix: https://github.com/MetaMask/metamask-mobile/pull/1275
    chainId = chainId.replace(/^Ox/, '0x')

    const parsedChainId = Number.parseInt(chainId, chainId.trim().substring(0, 2) === '0x' ? 16 : 10)
    invariant(!Number.isNaN(parsedChainId), `chainId ${chainId} is not an integer`)
    return parsedChainId
  } else {
    invariant(Number.isInteger(chainId), `chainId ${chainId} is not an integer`)
    return chainId
  }
}


export function normalizeAccount(_address: string): string {
  invariant(typeof _address === 'string' && _address.length == 21 , `Invalid address ${_address}`)
  
  decodeBase58Address(_address)

  return _address
}


export function decodeBase58Address(base58Address: string): number[] | null {
  if (base58Address.length <= 4) {
    return null;
  }

  let address: number[];
  try {
    address = decodeBase58(base58Address);
  } catch (e) {
    return null;
  }

  const len = address.length;
  const offset = len - 4;
  const checkSum = address.slice(offset);
  address = address.slice(0, offset);

  let shaObj = new jsSHA('SHA-256', 'HEX');
  shaObj.update(byteArray2hexStr(address));
  const hash0 = shaObj.getHash('HEX');

  shaObj = new jsSHA('SHA-256', 'HEX');
  shaObj.update(hash0);
  const hash1 = hexStr2byteArray(shaObj.getHash('HEX'));

  const checkSum1 = hash1.slice(0, 4);

  invariant(
    !(checkSum[0] === checkSum1[0] &&
      checkSum[1] === checkSum1[1] &&
      checkSum[2] === checkSum1[2] &&
      checkSum[3] === checkSum1[3]),
    `Bad address checksum ${address}`
  )

  return address;
}


