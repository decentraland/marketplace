export type Address = string

export type Allowance = Record<Address, number>
export type Allowances = Record<Address, Allowance>

export type Approval = Record<Address, boolean>
export type Approvals = Record<Address, Approval>

export type Authorization = {
  allowances: Partial<Allowances>
  approvals: Partial<Approvals>
}

export type AuthorizationRequest = {
  allowances: Record<Address, Address[]>
  approvals: Record<Address, Address[]>
}
