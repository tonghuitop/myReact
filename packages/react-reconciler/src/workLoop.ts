import { HostRoot } from './workTags'
import { beginWork } from './beginWork'
import { completeWork } from './completeWork'
import { MutationMask, NoFlags } from './FiberFlags'
import { createWorkInPropgress, FiberNode, FiberRootNode } from './fiber'
import { commitMutationEffects } from './commitWork'

/** 指针记录当前构建到哪个 fiber 节点 */
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
 * 计划任务
 * @param root
 */
const ensureRootIsScheduled = (root: FiberRootNode) => {
	// 一些调度行为
	// 在 根目录上开始执行同步工作
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

	if (workInProgress !== null) {
		console.error('render阶段结束时wip不为null')
	}

	const finishedWork = root.current.alternate
	root.finishedWork = finishedWork

	// commit 阶段操作
	commitRoot(root)
}

const commitRoot = (root: FiberRootNode) => {
	const finishedWork = root.finishedWork

	if (finishedWork === null) {
		return
	}

	// 重置
	root.finishedWork = null

	const subtreeHasEffect = finishedWork.subtreeFlags & MutationMask
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags

	if (subtreeHasEffect || rootHasEffect) {
		// 有副作用要执行

		// 阶段1/3: beforeMutation

		// 阶段2/3: Mutation
		commitMutationEffects(finishedWork)

		// Fiber Tree 切换
		root.current = finishedWork

		// 阶段3: Layout
	} else {
		// Fiber Tree 切换
		root.current = finishedWork
	}
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
 * 执行工作单元，采用深度优先遍历
 * @param fiber
 */
const performUnitOfWork = (fiber: FiberNode) => {
	const next = beginWork(fiber)

	// 当 next 为 null 时，说明没有子节点，
	// 则进行向上回溯，进入completeWork 阶段
	if (next === null) {
		completeUnitOfWork(fiber)
	} else {
		workInProgress = next
	}
}

/**
 * 完成当前节点的work，并赋值 Effect 链，然后移动到兄弟节点，重复该操作，当没有更多兄弟节点时
 * 返回至父节点，最终返回至 root 节点
 * @param fiber
 * @returns
 */
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
