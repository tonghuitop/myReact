/**
 * FiberNode的类型
 */
export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText

export const FunctionComponent = 0 /*  函数组件 */
export const HostRoot = 3 /*           渲染起点：ReactDOM.render、ReactDOM.createRoot */
export const HostComponent = 5 /*      原生DOM组件对应的Fiber节点*/
export const HostText = 6 /*           文本节点 */
