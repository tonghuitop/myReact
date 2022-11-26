import { ReactElement } from 'shared/ReactTypes'
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'

import { Placement } from './FiberFlags'
import { createFiberFromElement, FiberNode } from './fiber'

const ChildReconciler = (shouldTrackEffect: boolean) => {
	/**
	 * 协调单一元素
	 * @param returnFiber
	 * @param currentFirstChild
	 * @param element
	 * @returns
	 */
	const reconcileSingleElement = (
		returnFiber: FiberNode,
		currentFirstChild: FiberNode | null,
		element: ReactElement
	) => {
		// 前: abc 后: a 删除 bc
		// 前: a   后: b 删除 b、创建 a
		// 前: 无  后: a 创建 a
		currentFirstChild
		const fiber = createFiberFromElement(element)
		fiber.return = returnFiber
		return fiber
	}
	const placeSingleChild = (fiber: FiberNode) => {
		if (shouldTrackEffect) {
			fiber.flags |= Placement
		}
		return fiber
	}
	const reconcileChildFibers = (
		returnFiber: FiberNode,
		currentFirstChild: FiberNode | null,
		newChild?: ReactElement
	) => {
		// newChild 为 JSX
		// currentFirstChild 为 fiberNode
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFirstChild, newChild)
					)
			}
		}
		console.error('reconcile时未实现的child 类型')
		return null
	}
	return reconcileChildFibers
}

export const reconcileChildFibers = ChildReconciler(true)
export const mountChildFibers = ChildReconciler(false)
