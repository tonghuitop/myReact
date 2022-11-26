import { ReactElement } from 'shared/ReactTypes'

import { FiberNode } from './fiber'
import { processUpdateQueue } from './updateQueue'
import { HostComponent, HostRoot } from './workTags'
import { mountChildFibers, reconcileChildFibers } from './childFiber'

/**
 * 根据传入的Fiber节点创建子Fiber节点，并将这两个Fiber节点连接起来
 * @param workInProgress
 * @returns
 */
export const beginWork = (workInProgress: FiberNode) => {
	// mount
	switch (workInProgress.tag) {
		case HostRoot:
			return updateHostRoot(workInProgress)
		case HostComponent:
			return updateHostComponent(workInProgress)
		default:
			console.error('beginWork未处理的情况')
			return null
	}
}

const updateHostComponent = (workInProgress: FiberNode) => {
	// 根据element创建fiberNode
	const nextProps = workInProgress.pendingProps
	const nextChildren = nextProps.children
	reconcileChildren(workInProgress, nextChildren)
	return workInProgress.child
}

const updateHostRoot = (workInProgress: FiberNode) => {
	processUpdateQueue(workInProgress)
	const nextChildren = workInProgress.memoizedState
	reconcileChildFibers(workInProgress, nextChildren)
	return workInProgress.child
}

const reconcileChildren = (
	workInProgress: FiberNode,
	children?: ReactElement
) => {
	const current = workInProgress.alternate
	if (current !== null) {
		// update
		workInProgress.child = reconcileChildFibers(
			workInProgress,
			current.child,
			children
		)
	} else {
		// mount
		workInProgress.child = mountChildFibers(workInProgress, null, children)
	}
}
