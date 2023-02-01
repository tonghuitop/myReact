import { Key, Props, ReactElement, Ref } from 'shared/ReactTypes'

import { Container } from './hostConfig'
import { UpdateQueue } from './updateQueue'
import { Flags, NoFlags } from './FiberFlags'
import { FunctionComponent, HostComponent, WorkTag } from './workTags'

export class FiberNode {
	/** 新的变动，带来新的props */
	pendingProps: Props
	/** 上一次渲染完的props */
	memoizedProps: Props | null
	key: Key
	/** 跟当前Fiber相关本地状态（比如浏览器就是DOM节点） */
	stateNode: any
	/** 对于 FunctionComponent,指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName */
	type: any
	ref: Ref
	/** Fiber对应组件的类型 Function/Class/Host... */
	tag: WorkTag
	/** fiber 状态 */
	flags: Flags
	/** 子树的flag */
	subtreeFlags: Flags

	/** 指向父节点 */
	return: FiberNode | null
	/** 指向兄弟节点 */
	sibling: FiberNode | null
	/** 指向自己的第一个子节点 */
	child: FiberNode | null
	index: number
	/** 该Fiber对应的组件产生的Update会存在这个队列里面 */
	updateQueue: UpdateQueue | null
	/** 上一次渲染的时候的 state */
	memoizedState: any
	/** 连接 workInProgress 树 与 current Fiber树 */
	alternate: FiberNode | null

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag
		this.key = key
		this.stateNode = null
		this.type = null

		// 树结构
		this.return = null
		this.sibling = null
		this.child = null
		this.index = 0

		this.ref = null

		// 状态
		this.pendingProps = pendingProps
		this.memoizedProps = null
		this.updateQueue = null
		this.memoizedState = null

		// 副作用
		this.flags = NoFlags
		this.subtreeFlags = NoFlags

		this.alternate = null
	}
}

/**
 * fiberRoot 应用跟节点，唯一的
 */
export class FiberRootNode {
	container: Container
	current: FiberNode
	finishedWork: FiberNode | null
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container
		this.current = hostRootFiber
		hostRootFiber.stateNode = this
		this.finishedWork = null
	}
}

export function createFiberFromElement(element: ReactElement): FiberNode {
	const { type, key, props } = element
	let fiberTag: WorkTag = FunctionComponent
	if (typeof type === 'string') {
		fiberTag = HostComponent
	}
	const fiber = new FiberNode(fiberTag, props, key)
	fiber.type = type

	return fiber
}

/**
 * 创建 workInPropgress fiber
 * @param current
 * @param pendingProps
 * @returns
 */
export const createWorkInPropgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate

	if (wip === null) {
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key)
		wip.type = current.type
		wip.stateNode = current.stateNode

		wip.alternate = current
		current.alternate = wip
	} else {
		// update
		wip.pendingProps = pendingProps
	}

	wip.updateQueue = current.updateQueue
	wip.flags = current.flags
	wip.child = current.child

	// 数据
	wip.memoizedProps = current.memoizedProps
	wip.memoizedState = current.memoizedState

	return wip
}
