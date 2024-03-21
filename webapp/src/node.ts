import { Buffer } from 'buffer/'
;(globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer
