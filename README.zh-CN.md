# Scroll Reveal Motion

两个用于 Web 动效的 Agent Skill：**打开页面时渐入的首屏标题**，以及**随滚动浮现的内容区块**。

[English](README.md) | 简体中文

[![Validate](https://github.com/zhoulinhua0-star/scroll-reveal-motion/actions/workflows/validate.yml/badge.svg)](https://github.com/zhoulinhua0-star/scroll-reveal-motion/actions/workflows/validate.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-18181b.svg)](LICENSE)

![实际示例中的中英文标题完成帧，强调文字呈现粉色到紫色的渐变](assets/readme/reveal-example.png)

*来自[可运行示例](examples/reveal-composition.html)的完成帧。在本地运行，即可查看标题入场和下方卡片的滚动浮现。*

## 选择动效

| Skill | 触发时机与效果 | 当前包含 |
| --- | --- | --- |
| [`hero-text-reveal`](skills/hero-text-reveal/SKILL.md) | 打开页面 · 标题逐字淡入 | 实施指导、Phi 参考分析、原生组合示例 |
| [`scroll-reveal-motion`](skills/scroll-reveal-motion/SKILL.md) | 进入视口 · 单次向上浮现 | React/Next.js 组件、原生控制器、共享 CSS |

这些 Skill 为编程 Agent 提供指导和资源，由 Agent 适配你的前端。`hero-text-reveal` **目前没有内置可复用的 React 组件或通用文字拆分器**。示例中的文字在编写时已完成拆分，包含中文、emoji 和组合字符。

## 运行示例

在当前仓库根目录运行：

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

打开[本地示例](http://127.0.0.1:8765/examples/reveal-composition.html)。刷新查看标题入场，向下滚动查看卡片，再开启系统的“减少动态效果”对比完成态。GitHub 会展示 HTML 源码，不会在 README 内直接运行示例。

## 安装

两个 Skill 可以分别安装，也可以一起安装。下面的本地安装使用当前工作副本中的文件；插件市场使用上游已发布版本，可能尚未包含本地改动。

### Codex：从当前工作副本安装

将 Skill 包复制到[个人技能目录](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)：

```bash
mkdir -p ~/.agents/skills
cp -R skills/scroll-reveal-motion ~/.agents/skills/
cp -R skills/hero-text-reveal ~/.agents/skills/
```

每个技能名称保留一份安装。如果你已经在其他受支持的位置维护这些 Skill，请更新原有副本，避免重复安装。

### Claude Code：从当前工作副本加载

将仓库作为[本地插件](https://code.claude.com/docs/en/plugins#test-your-plugins-locally)加载：

```bash
claude --plugin-dir .
```

也可以将所需 Skill 包复制到 `~/.claude/skills/` 供个人使用。仓库包含一个名为 `scroll-reveal-motion` 的插件，其下有两个 Skill 目录。

<details>
<summary>安装已发布的 Claude Code 插件市场版本</summary>

```text
/plugin marketplace add zhoulinhua0-star/scroll-reveal-motion
/plugin install scroll-reveal-motion@scroll-reveal-motion
```

调用新 Skill 前，请确认安装版本包含 `skills/hero-text-reveal`。尚未发布的改动请使用上面的本地工作副本方式体验。

</details>

## 在同一项目中使用

安装两个 Skill 后，将目标页面交给你的智能体，并使用以下提示。Codex：

```text
使用 $hero-text-reveal 为首屏标题添加逐字入场动画，
使用 $scroll-reveal-motion 为首屏以下区块和功能卡片添加滚动浮现。
保留现有字体排版，复用项目已有的动画依赖，
在开启“减少动态效果”时直接显示完整构图。
```

Claude Code（已安装插件）：

```text
使用 /scroll-reveal-motion:hero-text-reveal 为首屏标题添加逐字入场动画，
使用 /scroll-reveal-motion:scroll-reveal-motion 为首屏以下区块和功能卡片添加滚动浮现。
保留现有字体排版，复用项目已有的动画依赖，
在开启“减少动态效果”时直接显示完整构图。
```

| 安装方式 | 首屏标题调用 | 滚动浮现调用 |
| --- | --- | --- |
| Codex | `$hero-text-reveal` | `$scroll-reveal-motion` |
| Claude Code 个人技能 | `/hero-text-reveal` | `/scroll-reveal-motion` |
| Claude Code 插件 | `/scroll-reveal-motion:hero-text-reveal` | `/scroll-reveal-motion:scroll-reveal-motion` |

Skill 会先检查目标技术栈，再适配效果。请提供页面或组件、要动画化的文字或元素组，以及时长或依赖方面的限制。

**同一页面，分别负责：** 首屏标题不要嵌套在滚动浮现容器里。两种动效分别管理自己的元素与时序，互不等待；统一“减少动态效果”的处理，并遵循项目已有的动效习惯。

## 动效与适配范围

| | 首屏文字 | 滚动区块 |
| --- | --- | --- |
| 起始参数 | 每字淡入 1,000ms、间隔 80ms、CSS `ease` | 上移 20–24px、位移 520–560ms、淡入 440–480ms |
| 动画属性 | 透明度；可选的后续强调色过渡 | 透明度和 transform |
| 时序 | 适合短标题；长文案调整间隔或按词、按行处理 | 约 16% 相交时触发；间隔 90ms，最多明显错开四项 |
| 依赖 | 指导复用项目动画库或浏览器原生能力 | React 模板仅依赖 React；原生模板无运行时依赖 |

首屏参数来自[对 Phi Browser 标题代码的分析](skills/hero-text-reveal/references/phi-entrance.md)。示例根据自身文案计算强调色出现时间，并使用较短的颜色过渡；它是适配示例，并非逐像素复刻。

两个 Skill 都要求内容具备可读的降级状态、完整语义和减少动态效果下的完成态。示例在禁用 JavaScript 时仍会完成有限时长的 CSS 标题入场，滚动区块始终可见；开启减少动态效果后，全部内容立即显示。

React/Next.js 首屏 hydration、应用路由、其他字体和更多语言仍需在目标项目中验证。浏览器示例覆盖的是原生静态页面，不包含这些框架生命周期。

<details>
<summary>稳定的滚动浮现接口</summary>

```text
data-scroll-reveal="single | stagger"
data-reveal-ready="true"
data-reveal-visible="true"

--reveal-delay
--reveal-distance
--reveal-duration
--reveal-fade-duration
--reveal-stagger
--reveal-ease
```

首屏动画使用独立的数据属性和 CSS 变量命名空间。新增首屏指导不改变上述已有契约。

</details>

## 验证

仓库检查需要 Node.js 20 或更高版本：

```bash
npm test
npm run validate
```

`npm test` 运行已有的八项滚动契约与控制器测试。`npm run validate` 还会检查两个 Skill 包、插件清单、原生 JavaScript 语法和 React 模板编译。React 检查使用固定版本 `esbuild@0.25.9`，需要访问 npm registry 或已有 npm 缓存。

可选浏览器测试在 Chromium 和 WebKit 中检查组合示例：逐字时序、完整标题名称、字素完整性、布局稳定性、滚动配合、360px 宽度、初始和实时减少动态效果，以及禁用 JavaScript 的表现。这些检查独立于默认 CI。

保持示例服务器运行，安装浏览器测试工具后执行：

```bash
npm install --no-save --package-lock=false playwright@1.62.1
npx playwright install chromium webkit
npm run check:browser
```

测试结果和截图输出到 `.tmp/browser-check/`。测试验证的是此示例，不代表所有浏览器或框架的适配都已完成。

## 仓库结构

```text
skills/
├── hero-text-reveal/            # 实施指导、展示元数据、参考分析
└── scroll-reveal-motion/        # 指导、元数据、React/原生/CSS 资源
examples/reveal-composition.html # 中英文可运行示例
assets/readme/                  # 示例实际截图
scripts/validate-skill.mjs       # Skill、契约与清单检查
tests/                          # 默认滚动测试与可选浏览器检查
.claude-plugin/                 # 一个插件及其市场条目
.github/workflows/validate.yml  # 默认仓库验证
```

仓库文档和浏览器示例位于可安装的 Skill 包之外。包与插件元数据为 `1.1.0`，即加入 `hero-text-reveal` 的版本；其余本地改动的存在不表示已经发布新版本。

## 贡献与许可证

已有滚动模板的要求见 [CONTRIBUTING.md](CONTRIBUTING.md)。请保持首屏指导聚焦，并在适配时验证目标项目的实际行为。

使用 [MIT License](LICENSE)。本项目与任何参考网站均无隶属或背书关系。
