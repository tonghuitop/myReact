### 项目整体流程

#### mount 阶段

1. ReactDOM.createRoot(DOM).render(React.Element)

- createRoot 会创建 fiberRoot 和 rootfiber。其中`fiberRoot`是整个应用的根节点，`rootFiber`是`<App />`所在组件树的根节点。

```
fiberRootNode.current = rootFiber
```
