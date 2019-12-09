import { ChainedCertificatedMessage, createAddressCertificateLink } from './ChainedCertificatedMessage'
import { Coordinate, isCoordinate } from './Coordinate'
import { DeploymentProvider } from "./DeploymentProvider"
import { LANDOwnershipProvider } from "./LANDOwnershipProvider"
import { LAND } from './LAND'
import { safeGetMessage } from './safeGetMessage'
import { createSignedMessage } from './SignedMessage'
import { secondTestIdentity, testIdentity } from './TestIdentities.spec'

describe('Fake LAND & Content provider example', () => {
  it('LANDOwnership is a trusted source of information.', () => {
    expect(JSON.parse(getDeploymentAndValidate(FakeLAND, FakeContentProvider, { x: 0, y: 0 }))).toEqual({
      x: 0,
      y: 0,
      content: `This is the content of land 0,0, owned by ${testIdentity.address} and signed by ${secondTestIdentity.address}`
    })
  })
})

const link = createAddressCertificateLink(testIdentity, secondTestIdentity)

const FakeLAND: LANDOwnershipProvider = {
  getLAND(coordinate: Coordinate): LAND {
    function fakeLand(x: number, y: number) {
      if (x < 10 && x > -10 && y < 10 && y > -10) {
        return { x, y, owner: testIdentity.address }
      }
    }
    if (isCoordinate(coordinate)) {
      return fakeLand(coordinate.x, coordinate.y)
    } else {
      throw new TypeError('Invalid arguments: must provide a coordinate or two numbers')
    }
  }
}

const FakeContentProvider: DeploymentProvider = {
  getDeployment(coordinate: Coordinate): ChainedCertificatedMessage {
    const { x, y } = coordinate
    return [
      link,
      createSignedMessage(secondTestIdentity, {
        x,
        y,
        content: `This is the content of land ${x},${y}, owned by ${testIdentity.address} and signed by ${secondTestIdentity.address}`
      })
    ]
  }
}

 function getDeploymentAndValidate(
  provider: LANDOwnershipProvider,
  content: DeploymentProvider,
  coordinate: Coordinate
) {
  const land = provider.getLAND(coordinate)
  if (coordinate === undefined) {
    return
  }
  const landInfo = content.getDeployment(coordinate)
  if (landInfo === undefined) {
    return
  }
  return safeGetMessage(land.owner, landInfo)
}