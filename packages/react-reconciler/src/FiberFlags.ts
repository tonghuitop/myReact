// fiber 状态
export type Flags = number

// 不要更改这两个值。它们被React Dev Tools使用。
export const NoFlags = /*                      */ 0b00000000000000000000000000
export const PerformedWork = /*                */ 0b00000000000000000000000001

// fiber 状态
/** 意味着 Fiber 节点 对应的 DOM 节点 需要插入页面中 */
export const Placement = /*                    */ 0b00000000000000000000000010
/** 意味着 Fiber 节点 对应的 DOM 节点 需要需要更新 */
export const Update = /*                       */ 0b00000000000000000000000100
/** 意味着 Fiber 节点 对应的 DOM 节点 需要删除 */
export const Deletion = /*                     */ 0b00000000000000000000001000
export const ChildDeletion = /*                */ 0b00000000000000000000010000

export const MutationMask = Placement | Update | ChildDeletion
