# Scroll Reveal Motion

一个用于为现代 Web 界面添加克制、无障碍且高性能滚动浮现动效的 Agent Skill。

[English](README.md) | 简体中文

[![Validate](https://github.com/zhoulinhua0-star/scroll-reveal-motion/actions/workflows/validate.yml/badge.svg)](https://github.com/zhoulinhua0-star/scroll-reveal-motion/actions/workflows/validate.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-18181b.svg)](LICENSE)

```text
进入视口  →  opacity + translateY  →  稳定呈现
```

这个 Skill 会先复用项目已有的动画依赖；如果项目没有动画库，则使用内置的原生 Intersection Observer 实现。它不会劫持滚动，能保证无 JavaScript 时内容仍然可见，并遵循 `prefers-reduced-motion`。

## 能做什么

| 目标 | 内置实现 | 运行时依赖 |
| --- | --- | --- |
| React 与 Next.js | 语义化 `ScrollReveal` 组件 | 仅 React |
| 原生 HTML/CSS/JavaScript | `initScrollReveal()` 控制器 | 无 |
| 已使用 Motion、Framer Motion 或 GSAP 的项目 | 集成指导 | 复用项目依赖 |

两套内置实现共享同一组数据属性、CSS 变量、动效默认值和单次触发行为。

## 安装

把下面这段直接发给 Codex：

```text
请使用 $skill-installer 从下面的 GitHub 仓库安装 scroll-reveal-motion Skill：
https://github.com/zhoulinhua0-star/scroll-reveal-motion

Skill 位于 skills/scroll-reveal-motion。
```

安装完成后，建议新建一个 Codex 对话，让 Skill 列表重新加载。如果仍未出现，请重启 Codex。

## 使用

然后显式调用：

```text
使用 $scroll-reveal-motion，为这个落地页的首屏以下区块和功能卡片添加克制的 fade-up 滚动浮现动效。
```

也可以直接描述你想要的效果：

```text
给这些卡片添加无障碍的 staggered scroll reveal，不要引入新的动画依赖。
```

Skill 会先检查目标前端，选择最小且兼容的实现，只在有助于视觉层级的位置添加动效，并运行项目已有的检查命令。

## 输入与产出

请提供：

- 目标前端仓库、页面或组件。
- 需要添加浮现效果的区块或元素组；也可以授权 Skill 自行选择。
- 动效或依赖方面的限制（如有）。

Skill 会产出：

- 适配后的 React 组件或原生 JavaScript 控制器。
- 已集成的浮现样式，以及更新后的目标标记或组件。
- 变更文件与验证结果摘要，包括减少动态效果模式的行为。

## 动效契约

- 元素与视口相交约 16% 时触发一次。
- 只对 `opacity` 和 `transform` 做动画。
- 默认使用克制的 20–24px 垂直位移和 520–560ms 减速过渡。
- 同组最多明显错开四个元素，每项间隔 90ms；后续元素与第四项同时出现。
- 在客户端初始化前、无 JavaScript 和减少动态效果模式下，内容始终可见。
- 保持 DOM 顺序、焦点顺序、指针行为和语义化元素不变。

稳定的集成接口有意保持精简：

```text
data-scroll-reveal="single | stagger"
data-reveal-ready="true"
data-reveal-visible="true"

--reveal-delay
--reveal-distance
--reveal-duration
--reveal-stagger
--reveal-ease
```

## 仓库结构

```text
scroll-reveal-motion/
├── skills/scroll-reveal-motion/   # 可安装的 Skill 包
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   └── assets/
│       ├── scroll-reveal.css
│       ├── react/scroll-reveal.tsx
│       └── vanilla/scroll-reveal.js
├── scripts/validate-skill.mjs     # 无依赖的仓库校验器
├── tests/                         # 契约与浏览器控制器测试
└── .github/workflows/validate.yml
```

仓库文档和自动化文件位于可安装的 Skill 包之外，确保 Agent 只加载执行任务所需的内容。

## 验证

运行时模板不会添加动画依赖。仓库验证需要 Node.js 20 或更高版本，并会在首次运行时下载固定版本的 `esbuild`，用于解析 React/TypeScript 资源。

```bash
npm test
npm run validate
```

本地已安装 Codex 的贡献者还可以运行官方 Skill 校验器：

```bash
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  skills/scroll-reveal-motion
```

## 发布状态

当前源码以 `v1.0.0` 契约为目标：包含 React/Next.js 与原生实现、框架选择指导、稳定的数据属性和 CSS 变量，以及可重复执行的验证流程。首次提交完成评审后，再创建 Git 标签和 GitHub Release。

## 贡献

请保持 Skill 精简且不依赖动画库。验证方式与兼容性要求请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

使用 [MIT License](LICENSE)。本项目实现的是常见的滚动浮现模式，与任何参考产品或网站均无隶属或背书关系。
