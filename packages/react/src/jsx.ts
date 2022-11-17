import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { Key, ElementType, Ref, Props, ReactElement } from 'shared/ReactTypes'

const ReactElement = (
	type: ElementType,
	key: Key,
	ref: Ref,
	props: Props
): ReactElement => {
	const element: ReactElement = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'TongHui'
	}
	return element
}

const hasValidKey = (config: any) => {
	return config.key !== undefined
}

const hasValidRef = (config: any) => {
	return config.ref !== undefined
}

/**
 * 将 jsx 转化为 element 节点
 * @param type
 * @param config
 * @returns
 */
const jsx = (type: ElementType, config: any) => {
	let key: Key = null
	const props: any = {}
	let ref: Ref = null

	// for in 会迭代对象除 Symbol 以外的 可枚举 属性
	for (const prop in config) {
		const val = config[prop]
		if (prop === 'key') {
			if (hasValidKey(config)) {
				key = '' + val
			}
			continue
		}
		if (prop === 'ref' && val !== undefined) {
			if (hasValidRef(config)) {
				ref = '' + val
			}
			continue
		}
		// hasOwnProperty 过滤去掉 继承 的属性
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val
		}
	}
	return ReactElement(type, key, ref, props)
}

export const jsxDEV = jsx
