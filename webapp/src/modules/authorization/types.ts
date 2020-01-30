export type Address = string

export type Privilege = Record<Address, boolean>
export type Privileges = Record<Address, Privilege>

export type Authorizations = {
  allowances: Partial<Privileges>
  approvals: Partial<Privileges>
}

export type AuthorizationDefinition = Record<Address, Address[]>
export type AuthorizationsRequest = {
  allowances: AuthorizationDefinition
  approvals: AuthorizationDefinition
}
