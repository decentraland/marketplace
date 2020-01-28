// @nico TODO: These two could be specified further
export type ContractName = string
export type TokenName = string

export type Allowance = Record<TokenName, number>
export type Allowances = Record<ContractName, Allowance>

export type Approval = Record<TokenName, boolean>
export type Approvals = Record<ContractName, Approval>

export type Authorization = { allowances: Allowances; approvals: Approvals }

export type ContractRequest = Record<ContractName, TokenName[]>
export type AuthorizationRequest = {
  allowances: ContractRequest
  approvals: ContractRequest
}
