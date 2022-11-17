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
	const hostRootFiber = new FiberNode(HostRoot, {}, null)
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
