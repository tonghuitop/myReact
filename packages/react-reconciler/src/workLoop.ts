import { HostRoot } from './workTags'
import { beginWork } from './beginWork'
import { completeWork } from './completeWork'
import { createWorkInPropgress, FiberNode, FiberRootNode } from './fiber'

let workInProgress: FiberNode | null = null

export const scheduleUpdateOnFiber = (fiber: FiberNode) => {
	const root = markUpdateLaneFromFiberToRoot(fiber)

	if (root === null) {
		return
	}
	ensureRootIsScheduled(root)
}

const markUpdateLaneFromFiberToRoot = (fiber: FiberNode) => {
	let node = fiber
	let parent = node.return
	while (parent !== null) {
		node = parent
		parent = node.return
	}
	// 当是 rootfiber
	if (node.tag === HostRoot) {
		return node.stateNode
	}
	return null
}

const ensureRootIsScheduled = (root: FiberRootNode) => {
	// 一些调度行为
	// 在 根目录上执行同步工作
	performSyncWorkOnRoot(root)
}

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

const prepareFreshStack = (root: FiberRootNode) => {
	workInProgress = createWorkInPropgress(root.current, {})
}

const workLoop = () => {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress)
	}
}

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
		const next = completeWork(node)

		if (next !== null) {
			workInProgress = next
			return
		}
		const sibling = node.sibling
		if (sibling) {
			workInProgress = next
			return
		}
		node = node.return
		workInProgress = node
	} while (node !== null)
}
