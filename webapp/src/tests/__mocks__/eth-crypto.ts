export default {
  publicKeyByPrivateKey: jest.fn(),
  sign: jest.fn(),
  recover: jest.fn(),
  encryptWithPublicKey: jest.fn(),
  decryptWithPrivateKey: jest.fn(),
  cipher: {
    parse: jest.fn()
  },
  publicKey: {
    compress: jest.fn(),
    decompress: jest.fn()
  }
}
