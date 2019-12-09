import { ChainedCertificatedMessage } from './ChainedCertificatedMessage'
import { Coordinate } from './Coordinate'

/**
 * Interface for retrieving deployment information about a parcel.
 * We can't trust this, as it's off-chain.
 */
export type DeploymentProvider = {
  getDeployment: (coordinate: Coordinate) => ChainedCertificatedMessage;
}
