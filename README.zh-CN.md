# Scroll Reveal Motion

两个用于 Web 动效的 Agent Skill：**打开页面时逐字渐入的首屏标题**，以及**随滚动浮现的内容区块**。

[English](README.md) | 简体中文

[![Validate](https://github.com/zhoulinhua0-star/scroll-reveal-motion/actions/workflows/validate.yml/badge.svg)](https://github.com/zhoulinhua0-star/scroll-reveal-motion/actions/workflows/validate.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-18181b.svg)](LICENSE)

## 效果

| Skill | 触发时机 | 效果 |
| --- | --- | --- |
| [`hero-text-reveal`](skills/hero-text-reveal/SKILL.md) | 打开页面 | 标题逐字淡入——每字 1,000ms、字间隔 80ms，可选的强调色在文字稳定后出现 |
| [`scroll-reveal-motion`](skills/scroll-reveal-motion/SKILL.md) | 进入视口 | 区块与卡片上移 20–24px 并单次淡入，元素间隔 90ms，最多明显错开四项 |

两者全程保持文字可读：禁用 JavaScript 时内容完整，标题语义不被破坏，开启「减少动态效果」时直接显示完成态。

这些 Skill 为编程 Agent 提供指导和资源，由 Agent 适配你的前端，并非开箱即用的组件库。`scroll-reveal-motion` 内置 React/Next.js 组件、原生控制器和共享 CSS；`hero-text-reveal` 目前只提供实施指导和参考参数，尚无可复用的 React 组件或通用文字拆分器。

## 安装

### Claude Code

```text
/plugin marketplace add zhoulinhua0-star/scroll-reveal-motion
/plugin install scroll-reveal-motion@scroll-reveal-motion
```

安装后请重启 Claude Code——正在运行的会话会保持启动时的版本。之后用 `/plugin update scroll-reveal-motion@scroll-reveal-motion` 获取新版本。

### Codex

将 Skill 包复制到[个人技能目录](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)：

```bash
git clone https://github.com/zhoulinhua0-star/scroll-reveal-motion.git
mkdir -p ~/.agents/skills
cp -R scroll-reveal-motion/skills/hero-text-reveal ~/.agents/skills/
cp -R scroll-reveal-motion/skills/scroll-reveal-motion ~/.agents/skills/
```

每个技能名称保留一份安装。如果你已在其他位置维护这些 Skill，请更新原有副本，避免重复。

## 使用

| 安装方式 | 首屏标题 | 滚动浮现 |
| --- | --- | --- |
| Claude Code 插件 | `/scroll-reveal-motion:hero-text-reveal` | `/scroll-reveal-motion:scroll-reveal-motion` |
| Claude Code 个人技能 | `/hero-text-reveal` | `/scroll-reveal-motion` |
| Codex | `$hero-text-reveal` | `$scroll-reveal-motion` |

调用时请一并说明目标和限制——Skill 会先检查你的技术栈再适配效果，因此需要知道要动画化的对象：

```text
使用 /scroll-reveal-motion:hero-text-reveal 为 src/app/page.tsx 中的 h1 添加逐字入场，
使用 /scroll-reveal-motion:scroll-reveal-motion 为下方的功能卡片添加滚动浮现。
保留现有字体排版，复用项目已有的动画依赖，
在开启「减少动态效果」时直接显示完整构图。
```

两个 Skill 可以单独使用。若在同一页面同时使用，首屏标题不要嵌套在滚动浮现容器里：两种动效各自管理自己的元素与时序，互不等待。

## 许可证

使用 [MIT License](LICENSE)。贡献方式见 [CONTRIBUTING.md](CONTRIBUTING.md)。本项目与任何参考网站均无隶属或背书关系。
