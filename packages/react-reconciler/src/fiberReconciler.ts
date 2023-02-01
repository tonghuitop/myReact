import { HostRoot } from './workTags'
import { Container } from './hostConfig'
import { scheduleUpdateOnFiber } from './workLoop'
import { ReactElement } from 'shared/ReactTypes'
import { FiberNode, FiberRootNode } from './fiber'

import {
	createUpdate,
	enqueueUpdate,
	initializeUpdateQueue
} from './updateQueue'

export const createContainer = (container: Container) => {
	// 创建rootFiber 组件树 的根节点
	const hostRootFiber = new FiberNode(HostRoot, {}, null)
	// 创建 fiberRoot 应用根节点，唯一的
	const root = new FiberRootNode(container, hostRootFiber)
	initializeUpdateQueue(hostRootFiber)
	return root
}

export const updateContainer = (element: ReactElement, root: FiberRootNode) => {
	const hostRootFiber = root.current
	const update = createUpdate(element)
	enqueueUpdate(hostRootFiber, update)
	scheduleUpdateOnFiber(hostRootFiber)
}
