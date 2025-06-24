# yichun-guide-app

**使用 vue-mini 开发，使用 create-vue-mini 创建。使用 Skyline 渲染，支持深色模式。**

## 版本说明

⚠️ **重要提示**：截止到 commit `549eaa09c317298a79540c5ec75138e7bf4e7fa2` (tag: `v0.0.0-wechat-cloud`)，本项目采用的是微信云开发环境；之后的版本改为传统的服务器 RESTFUL API。

扫码体验：

![小程序码](./qrcode.jpg)

**源码仅供学习交流，欢迎 Star 和 Fork。**

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
