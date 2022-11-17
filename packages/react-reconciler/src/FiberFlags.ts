// fiber 状态
export type Flags = number

// 不要更改这两个值。它们被React Dev Tools使用。
export const NoFlags = /*                      */ 0b00000000000000000000000000
export const PerformedWork = /*                */ 0b00000000000000000000000001

// fiber 状态
export const Placement = /*                    */ 0b00000000000000000000000010
export const Update = /*                       */ 0b00000000000000000000000100
export const Deletion = /*                     */ 0b00000000000000000000001000
