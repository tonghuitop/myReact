import { FiberNode } from './fiber'

type UpdateAction = any

export interface Update {
	action: UpdateAction
}

export interface UpdateQueue {
	shared: {
		// 触发更新时，产生的 Update 会保存在此，并生成单向环状链表
		pending: Update | null
	}
}

// 创建
export const createUpdate = (action: UpdateAction) => {
	return {
		action
	}
}

// 插入
export const enqueueUpdate = (fiber: FiberNode, update: Update) => {
	const updateQueue = fiber.updateQueue
	if (updateQueue !== null) {
		updateQueue.shared.pending = update
	}
}

/** 创建更新的循环队列 */
export const initializeUpdateQueue = (fiber: FiberNode) => {
	fiber.updateQueue = {
		shared: {
			pending: null
		}
	}
}

// 消费
export const processUpdateQueue = (fiber: FiberNode) => {
	const updateQueue = fiber.updateQueue
	let newState = null
	if (updateQueue) {
		const pending = updateQueue.shared.pending
		const pendingUpdate = pending
		updateQueue.shared.pending = null

		if (pendingUpdate !== null) {
			const action = pendingUpdate.action
			if (typeof action === 'function') {
				newState = action()
			} else {
				newState = action
			}
		}
	} else {
		console.error(fiber, ' processUpdateQueue 时 updateQueue不存在')
	}
	fiber.memoizedState = newState
}
