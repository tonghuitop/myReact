import { HostRoot } from './workTags'
import { beginWork } from './beginWork'
import { completeWork } from './completeWork'
import { createWorkInPropgress, FiberNode, FiberRootNode } from './fiber'

let workInProgress: FiberNode | null = null

/**
 * 协调更新fiber
 * @param fiber
 * @returns
 */
export const scheduleUpdateOnFiber = (fiber: FiberNode) => {
	const root = markUpdateLaneFromFiberToRoot(fiber)

	if (root === null) {
		return
	}
	ensureRootIsScheduled(root)
}

/**
 * 标记从光纤到根的更新通道
 * @param fiber
 * @returns
 */
const markUpdateLaneFromFiberToRoot = (fiber: FiberNode) => {
	let node = fiber
	let parent = node.return
	// rootFiber 根节点的 parent 为null
	while (parent !== null) {
		node = parent
		parent = node.return
	}
	// 当是 rootfiber, stateNode
	if (node.tag === HostRoot) {
		return node.stateNode
	}
	return null
}

/**
 * 确保根已计划
 * @param root
 */
const ensureRootIsScheduled = (root: FiberRootNode) => {
	// 一些调度行为
	// 在 根目录上执行同步工作
	performSyncWorkOnRoot(root)
}

/**
 * 从 fiber root 上执行同步工作
 * @param root
 */
const performSyncWorkOnRoot = (root: FiberRootNode) => {
	// 初始化操作
	prepareFreshStack(root)

	// render 阶段具体操作
	do {
		try {
			workLoop()
			break
		} catch (e) {
			console.error('workLoop 发生错误', e)
			workInProgress = null
		}
	} while (true)

	// commit 阶段操作
	console.log('render结束', root)
}

/**
 * 初始化 workInProgress 树的fiberRoot
 * @param root
 */
const prepareFreshStack = (root: FiberRootNode) => {
	workInProgress = createWorkInPropgress(root.current, {})
}

/**
 * 递归所有的 fiber
 */
const workLoop = () => {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress)
	}
}

/**
 * 执行工作单元
 * @param fiber
 */
const performUnitOfWork = (fiber: FiberNode) => {
	const next = beginWork(fiber)

	if (next === null) {
		completeUnitOfWork(fiber)
	} else {
		workInProgress = next
	}
}

const completeUnitOfWork = (fiber: FiberNode) => {
	let node: FiberNode | null = fiber

	do {
		// 对节点进行completeWork，生成DOM，更新props，绑定事件
		const next = completeWork(node)

		if (next !== null) {
			// 任务被挂起
			workInProgress = next
			return
		}
		// 查找兄弟节点，若有则进行beginWork ->  completeWork
		const sibling = node.sibling
		if (sibling) {
			workInProgress = next
			return
		}
		// 查找父亲节点
		node = node.return
		workInProgress = node
	} while (node !== null)
}
