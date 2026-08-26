<p align="center">
  <img src="./assets/readme/hero.svg" width="100%" alt="Scroll Reveal Motion——用于克制、无障碍视口入场动效的 Agent Skill">
</p>

<p align="center">
  <a href="README.md">English</a> · 简体中文
</p>

<p align="center">
  <a href="https://github.com/zhoulinhua0-star/scroll-reveal-motion/actions/workflows/validate.yml"><img src="https://github.com/zhoulinhua0-star/scroll-reveal-motion/actions/workflows/validate.yml/badge.svg" alt="验证状态"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-18181b.svg" alt="MIT 许可证"></a>
</p>

Scroll Reveal Motion 是一个 Agent Skill，帮助编码智能体为现代 Web 界面添加精致的滚动揭示动效。它会优先复用目标项目已有的动画依赖，否则采用内置的 React 或原生实现，同时确保服务端渲染内容始终可见，并尊重用户的动效偏好。

```text
视口下方  →  16% 阈值  →  opacity + translateY  →  一次性稳定显示
```

## 快速开始

### 1. 安装 Skill

将以下内容复制到 Codex：

```text
Use $skill-installer to install the scroll-reveal-motion Skill from this
GitHub repository:
https://github.com/zhoulinhua0-star/scroll-reveal-motion

The Skill is located at skills/scroll-reveal-motion.
```

> **语法说明：** `$` 是 Codex 的 Skill 调用符号，不是终端提示符。ChatGPT 使用 `@`，Claude Code 使用 `/`。

安装后请新建一个 Codex 任务，使 Skill 列表重新加载；若仍未出现，请重启 Codex。

### 2. 描述需要的效果

```text
Use $scroll-reveal-motion to add restrained fade-up reveals to the
below-the-fold sections and feature cards on this landing page.
```

也可以直接使用自然语言：

```text
为这些卡片添加无障碍的交错滚动揭示效果，且不要引入新的动画依赖。
```

Skill 会先检查目标前端，选择最小且兼容的实现，仅在有助于信息层级的位置应用动效，并运行项目自身的检查命令。

## 如何选择实现

| 目标项目 | Skill 的处理方式 | 新增动画依赖 |
| --- | --- | --- |
| Motion、Framer Motion、GSAP 或其他动画库 | 复用现有库，并匹配共享动效契约 | 无 |
| React 或 Next.js | 调整语义化 `ScrollReveal` 组件与共享 CSS | 除 React 外无 |
| 原生 HTML/CSS/JavaScript | 调整 `initScrollReveal()` 控制器与共享 CSS | 无 |
| 未使用动画库的其他框架 | 将原生控制器适配到框架生命周期 | 无 |

两个内置实现共享相同的属性、CSS 变量、默认值和一次性揭示行为。

## 会改变什么，又会保护什么

Skill 会产出适配后的组件或控制器、集成后的揭示样式、更新后的目标标记，以及验证结果摘要。它通过以下约束保持效果克制可靠：

- 服务端渲染、客户端初始化前以及无 JavaScript 时，内容始终可见。
- 初始状态和等待揭示期间的偏好变化都会遵循 `prefers-reduced-motion`。
- 仅动画 `opacity` 和 `transform`，不劫持滚动，也不动画布局属性。
- 保持 DOM 顺序、焦点顺序、语义、指针行为和原生布局不变。
- 一次性揭示完成或组件清理时断开观察器。

## 动效契约

- 在约 `16%` 视口交叉比例处触发一次，并使用轻微的负底部 root margin。
- 从 `translateY(20–24px)` 过渡到静止位置，同时由透明淡入不透明。
- 使用 `520–560ms` 的减速过渡。
- 相关子项最多以 `90ms` 间隔交错四次；之后的子项共享第四个延迟。
- 首屏内容和关键说明始终立即可用。

<details>
<summary><strong>稳定的属性与 CSS 变量</strong></summary>

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

若要修改这一接口，需要同步更新两个内置实现、共享 CSS 和验证逻辑。

</details>

## 需要提供什么

- 目标前端仓库、页面或组件。
- 需要揭示的区块或分组，或授权 Skill 自行选择。
- 任何动效、浏览器或依赖限制。

## 仓库结构

<details>
<summary><strong>查看可安装包与仓库工具</strong></summary>

```text
scroll-reveal-motion/
├── skills/scroll-reveal-motion/   # 可安装的 Skill 包
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   └── assets/
│       ├── scroll-reveal.css
│       ├── react/scroll-reveal.tsx
│       └── vanilla/scroll-reveal.js
├── scripts/validate-skill.mjs     # 无依赖的仓库验证器
├── tests/                         # 契约与控制器测试
└── .github/workflows/validate.yml
```

仓库文档和自动化配置放在可安装 Skill 包之外，使智能体只加载完成任务所需的文件。

</details>

## 验证

运行时模板不会添加动画依赖。仓库验证需要 Node.js 20 或更高版本，并会在首次运行时下载固定版本的 `esbuild` 二进制文件，用于解析 React/TypeScript 资源。

```bash
npm test
npm run validate
```

已安装 Codex 的贡献者还可以运行官方 Skill 验证器：

```bash
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  skills/scroll-reveal-motion
```

## 贡献

请保持改动聚焦、无障碍并谨慎引入依赖。验证与兼容性要求详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

[MIT](LICENSE)。本项目实现的是通用滚动揭示模式，与所提及的任何产品或网站均无隶属、授权或背书关系。
