### 关键词

#### Fiber 对象

一个 fiber 对象是表征 work 的一个基本单元
每个 React 元素对应一个 fiber 对象，fibers 是一个基于 child、sibling 和 return 属性构成的链表。

```
Fiber= {
  // 标识 fiber 类型的标签
  tag: WrokTag,

  // 一个组件、一个DOM节点或其他跟fiber节点相关联的React元素的实例引用
  stateNode: any,

  // 指向父节点
  return: Fiber | null,

  // 指向子节点
  child: Fiber | null,

  // 指向兄弟节点
  sibling: Fiber | null,

  // 在开始执行时设置的props参数
  pendingProps: any,

  // 在结束时设置的props
  memoizedProps: any,

  // updateQueue是一个具有updates优先级的链表
  updateQueue: UpdateQueue<any> | null,

  // 当前 state
  memoizedState: any,

  // Effect
  // 通常吧手动更改DOM或在生命周期中执行数据请求、订阅等操作，不能在render阶段完成的work，称为side effects
  effectTag: SideEffectTag,

  // Effects list列表是基于fiber对象由firstEffect、nextEffect和lastEffect属性构成的链表结构
  nextEffect: Fiber | null,
  firstEffect: Fiber | null,
  lastEffect: Fiber | null,

  // 表示将来完成此工作的时间
  expirationTime: ExpirationTime,

  // 这用于快速确定子树是否没有挂起的更改
  childExpirationTime: ExpirationTime,

  // 替代节点。该节点构成 workInProgree 树
  alternate: Fiber | null,
}
```

#### work

在 React reconciliation 过程中出现的各种如 state update，props update 或 refs update 等必须执行计算的活动，在 Fiber 架构体系中统称为"work"

#### workTag

用于描述一个 React 元素的类型，即 fiber 对象的 fiber.tag

#### current 树和 workInProgress 树

首次渲染后，React 生成一个用于渲染 UI 并能映射应用状态的 fiber 树，我们通常称之为 current 树。当 React 遍历 current 树，它为每一个存在的 fiber 节点创建一个 alternate 属性的替代节点，该节点构成 workInProgress 树。

所有发生 update 的 work 都在 workInProgress 树中执行，如果 alternate 属性还未创建，React 将在处理 update 之前在 createWorkInProgress 函数中创建一个 current 树的副本，即形成 WorkInProgress 树，用于映射新的状态并在 commit 阶段刷新到屏幕。

#### Effects list

Effects list 列表是基于 fiber 对象由 firstEffect、nextEffect 和 lastEffect 属性构成的链表结构，当发现和他类型相关用途函数，就应用调用，比如 DOM 改变、相关生命周期函数调用等。
