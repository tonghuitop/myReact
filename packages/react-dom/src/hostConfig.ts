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
 * 原生DOM 添加子 DOM
 * @param parent
 * @param child
 */
export const appendInitialChild = (parent: Instance, child: Instance) => {
	parent.appendChild(child)
}
