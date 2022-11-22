(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["jsx-dev-runtime"] = global["jsx-dev-runtime"] || {}, global["jsx-dev-runtime"].js = {})));
})(this, (function (exports) { 'use strict';

	const REACT_ELEMENT_TYPE = Symbol.for('react.element');

	const ReactElement = (type, key, ref, props) => {
	    const element = {
	        $$typeof: REACT_ELEMENT_TYPE,
	        type,
	        key,
	        ref,
	        props,
	        __mark: 'TongHui'
	    };
	    return element;
	};
	const hasValidKey = (config) => {
	    return config.key !== undefined;
	};
	const hasValidRef = (config) => {
	    return config.ref !== undefined;
	};
	/**
	 * 将 jsx 转化为 element 节点
	 * @param type
	 * @param config
	 * @returns
	 */
	const jsx = (type, config) => {
	    let key = null;
	    const props = {};
	    let ref = null;
	    // for in 会迭代对象除 Symbol 以外的 可枚举 属性
	    for (const prop in config) {
	        const val = config[prop];
	        if (prop === 'key') {
	            if (hasValidKey(config)) {
	                key = '' + val;
	            }
	            continue;
	        }
	        if (prop === 'ref' && val !== undefined) {
	            if (hasValidRef(config)) {
	                ref = '' + val;
	            }
	            continue;
	        }
	        // hasOwnProperty 过滤去掉 继承 的属性
	        if ({}.hasOwnProperty.call(config, prop)) {
	            props[prop] = val;
	        }
	    }
	    return ReactElement(type, key, ref, props);
	};
	const jsxDEV = jsx;

	exports.jsxDEV = jsxDEV;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
