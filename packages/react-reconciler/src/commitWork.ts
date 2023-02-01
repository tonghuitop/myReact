import { FiberNode, FiberRootNode } from './fiber'
import { HostComponent, HostRoot, HostText } from './workTags'
import { MutationMask, NoFlags, Placement } from './FiberFlags'
import { appendChildToContainer, Container } from './hostConfig'

let nextEffect: FiberNode | null

export const commitMutationEffects = (finishedWork: FiberNode) => {
	nextEffect = finishedWork

	while (nextEffect !== null) {
		// 向下遍历
		const child: FiberNode | null = nextEffect.child
		if (
			(nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
			child !== null
		) {
			nextEffect = child
		} else {
			// 向上遍历
			up: while (nextEffect !== null) {
				commitMutationEffectsOnFiber(nextEffect)
				const sibling: FiberNode | null = nextEffect.sibling
				if (sibling !== null) {
					nextEffect = sibling
					break up
				}
				nextEffect = nextEffect.return
			}
		}
	}
}

const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
	const flags = finishedWork.flags

	if ((flags & Placement) !== NoFlags) {
		// 插入/移动
		commitPlacement(finishedWork)
		finishedWork.flags &= ~Placement
	}
}

const commitPlacement = (finishedWork: FiberNode) => {
	const hostParent = getHostParent(finishedWork) as FiberNode
	let parentStateNode
	switch (hostParent.tag) {
		case HostRoot:
			parentStateNode = (hostParent.stateNode as FiberRootNode).container
			break
		case HostComponent:
			parentStateNode = hostParent.stateNode
	}
	// appendChild / insertBerfore
	appendPlacementNodeIntoContainer(finishedWork, parentStateNode)
}

const appendPlacementNodeIntoContainer = (
	fiber: FiberNode,
	parent: Container
) => {
	if (fiber.tag === HostComponent || fiber.tag === HostText) {
		appendChildToContainer(fiber.stateNode, parent)
		return
	}
	const child = fiber.child
	if (child !== null) {
		appendPlacementNodeIntoContainer(child, parent)
		let sibling = child.sibling

		while (sibling !== null) {
			appendPlacementNodeIntoContainer(sibling, parent)
			sibling = sibling.sibling
		}
	}
}

/**
 * 获取原生DOM的parent节点
 * @param fiber
 * @returns
 */
const getHostParent = (fiber: FiberNode) => {
	let parent = fiber.return
	while (parent) {
		const parentTag = parent.tag
		if (parentTag === HostComponent || parentTag === HostRoot) {
			return parent
		}

		parent = parent.return
	}
	console.error('getHostParent未找到hostParent')
	return
}
