# tree-sitter-bsn

[Tree-sitter](https://tree-sitter.github.io/) 语法解析器，用于 [Bevy Scene Notation (BSN)](https://bsn.dev/)。

## 安装

### Helix 编辑器

将以下配置添加到 `~/.config/helix/languages.toml`：

```toml
# ==================== BSN (Bevy Scene Notation) ====================
[[language]]
name = "bsn"
scope = "source.bsn"
injection-regex = "bsn"
file-types = ["bsn"]
roots = []
auto-format = false
comment-token = "//"
block-comment-tokens = { start = "/*", end = "*/" }
indent = { tab-width = 2, unit = "  " }

[[grammar]]
name = "bsn"
source = { git = "https://github.com/erasin/tree-sitter-bsn", rev = "HEAD" }
```

```bash
hx --grammar fetch
hx --grammar build
```

重启 Helix，打开 `.bsn` 文件即可使用。

## 语法支持

```bsn
:"player.bsn"           # 继承声明
Player                   # 实体
Sprite { image: "player.png" }  # 结构体身体
Health(10)              # 元组身体
Transform {             # 嵌套结构
    translation: Vec3 { y: 4.0 }
}
Children [               # 块结构
    (Hat)
    (Sprite { image: "hat.png" })
]
#Root                  # 名称简写
@mytemplate { value: 10 }  # 模板补丁
Emotion::Happy { amount: 10 }  # 作用域标识符
Transform::IDENTITY     # 作用域常量
```

**注意**: Rust 闭包语法（如 `on(|jump: On<Jump>| { ... })`）不属于 BSN 格式，
仅存在于 Rust 代码的 `bsn!` 宏调用中。

## 项目结构

```
├── grammar.js          # Tree-sitter 语法定义
├── src/                # 生成的解析器代码
├── queries/            # Helix 查询文件
│   ├── highlights.scm  # 语法高亮
│   ├── indents.scm     # 缩进规则
│   ├── textobjects.scm  # 文本对象
│   ├── tags.scm        # 代码导航
│   ├── rainbows.scm    # 彩虹括号
│   └── injections.scm  # 语言注入
└── test.bsn            # 测试文件
```

## 本地开发

```bash
# 生成解析器
tree-sitter generate

# 测试解析
tree-sitter parse test.bsn

# 运行测试
tree-sitter test
```

## Rust 中的 bsn! 宏高亮

在 Rust 文件中使用 `bsn!` 或 `bsn_list!` 宏时，可以通过语言注入获得 BSN 语法高亮。

### 配置步骤

1. 创建/编辑 Rust 注入查询文件：

```bash
mkdir -p ~/.config/helix/runtime/queries/rust
cat >> ~/.config/helix/runtime/queries/rust/injections.scm << 'EOF'
; Inject BSN highlighting for bsn! and bsn_list! macros in Rust
((macro_invocation
    macro: (identifier) @_macro
    (token_tree) @injection.content)
  (#match? @_macro "^(bsn|bsn_list)$")
  (#set! injection.language "bsn"))
EOF
```

2. 重启 Helix，打开 Rust 文件即可看到 `bsn!` 宏内容的高亮。

### 示例效果

```rust
fn player() -> impl Scene {
    bsn! {
        Player
        Sprite { image: "player.png" }
        Transform {
            translation: Vec3 { y: 4.0 }
        }
    }
}
```

## 相关链接

- [Bevy Scene Notation 文档](https://bsn.dev/)
- [Tree-sitter 官方文档](https://tree-sitter.github.io/)
- [Helix 编辑器](https://helix-editor.com/)
