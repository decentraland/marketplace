import { Address } from './Address'
import { ChainedCertificatedMessage, validateChainedSignature } from './ChainedCertificatedMessage'

export function safeGetMessage(sender: Address, messages: ChainedCertificatedMessage): string {
  if (validateChainedSignature(sender, messages)) {
    return messages[messages.length - 1].payload
  }
}
