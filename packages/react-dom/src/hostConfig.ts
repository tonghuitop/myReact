/** 容器 */
export type Container = Element | Document
/** 实例 */
export type Instance = Element
/** 文本 */
export type TextInstanve = Text

/**
 * 创建真是的 DOM
 * @param type
 * @returns
 */
export const createInstance = (type: string) => {
	return document.createElement(type)
}

/**
 * 创建文本DOM
 * @param content
 * @returns
 */
export const createTextInstance = (content: string) => {
	return document.createTextNode(content)
}

/**
 * 原生DOM 添加子 DOM
 * @param parent
 * @param child
 */
export const appendInitialChild = (parent: Instance, child: Instance) => {
	parent.appendChild(child)
}

export const appendChildToContainer = (
	child: Instance,
	container: Container
) => {
	container.appendChild(child)
}
