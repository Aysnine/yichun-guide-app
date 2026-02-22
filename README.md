# yichun-guide-app

**使用 vue-mini 开发，使用 create-vue-mini 创建。使用 Skyline 渲染，支持深色模式。**

## 版本说明

⚠️ **重要提示**：截止到 commit `549eaa09c317298a79540c5ec75138e7bf4e7fa2` (tag: `v0.0.0-wechat-cloud`)，本项目采用的是微信云开发环境；之后的版本改为传统的服务器 RESTFUL API。

扫码体验：

![小程序码](./qrcode.jpg)

**源码仅供学习交流，欢迎 Star 和 Fork。**

## 关于 Tanstack Query 集成

当前项目集成了 Tanstack Query，其拥有强大的异步状态管理、服务器状态工具和数据获取功能。

由于 `@tanstack/vue-query` 无法直接使用，所以当前项目是基于 `@tanstack/query-core` 实现的，只有简单的封装，集成时的版本是 `5.90.20`。

集成代码：[src/lib/vue-mini-query](./src/lib/vue-mini-query/index.ts)

### 基本原理

在 `app.ts` 里注入 `queryClient` 实例：

```ts
// ! 由于小程序里不支持 AbortSignal，需要 polyfill
import '@/lib/vue-mini-query/polyfill';

createApp(() => {
  // ...

  // 全局注入 queryClient
  provideQueryClient();

  console.log('App Launched!');
});
```

在页面或组件中使用 `useQuery`：

```ts
import { useQuery } from '@/lib/vue-mini-query';

const attractionsQuery = useQuery({
  queryKey: ['attractions', { query: { includeTickets } }],
  queryFn: fetchAttractions,
});
```

### API 封装

- [x] provideQueryClient()
- [x] useQueryClient()
- [x] useQuery<T>()
- [ ] useMutation<T>()
- ...

### 当前项目实践

原来的 API 调用方式：ui -> api

现在的 API 调用方式：ui -> hooks -> api

两种调用方式可以并存。

代码结构：

- `src/api`：函数式的后端 API 调用封装
- `src/api/base`：封装了 `requestApi()`，支持 AbortSignal
- `src/hooks`：对 api 的封装，状态由 tanstack query 进行统一管理
- `src/pages`：尽可能使用 hooks 去请求

### 打包上传问题

由于 `dist/@tanstack/query-core/index.js` 中使用了比较新的语法，如 `class #foo` 私有成员，小程序打包上传时会报错，可以在微信开发者工具的详情设置里勾选“将 JS 编译成 ES5” 来解决。

## 开发

⚠️ 注意：将此项目导入微信开发者工具时请选择项目根目录而非 `dist` 目录。

更多信息请访问官方文档：[vuemini.org](https://vuemini.org)

## 数据模型

- 景点：`Attraction`
- 景点门票：`AttractionTicket`
- 特产：`Specialty`

## 文件存储结构

- `/assets/`：存放固定的图片资源
- `/attraction/:id/`：存放景点的图片
- `/specialty/:id/`：存放特产的图片

## 设置环境变量

创建 `.env.local` 文件，复制 `.env.template` 文件内容到 `.env.local` 文件中，并根据实际情况修改其中的环境变量。

## 依赖安装

```sh
yarn
```

## 本地开发

```sh
yarn dev
```

## 生产构建

```sh
yarn build
```

## 代码格式化

```sh
yarn format
```

## TS 代码质量检测

```sh
yarn lint:script
```

## CSS 代码质量检测

```sh
yarn lint:style
```

## 类型检测

```sh
yarn type-check
```

## License

[GPL-3.0](./LICENSE)
