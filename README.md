# tree-sitter-bsn

A [Tree-sitter](https://tree-sitter.github.io/) grammar for [Bevy Scene Notation (BSN)](https://bsn.dev/).

## Installation

### Helix Editor

Add the following configuration to `~/.config/helix/languages.toml`:

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

Restart Helix and open a `.bsn` file to use the grammar.

## Syntax Support

```bsn
:"player.bsn"           # inheritance declaration
Player                   # entity
Sprite { image: "player.png" }  # struct body
Health(10)              # tuple body
Transform {             # nested struct
    translation: Vec3 { y: 4.0 }
}
Children [               # block structure
    (Hat)
    (Sprite { image: "hat.png" })
]
#Root                  # name shorthand
@mytemplate { value: 10 }  # template patch
Emotion::Happy { amount: 10 }  # scoped identifier
Transform::IDENTITY     # scoped constant
```

**Note**: Rust closure syntax (e.g. `on(|jump: On<Jump>| { ... })`) is not part of BSN format,
it only exists in Rust code's `bsn!` macro invocations.

## Project Structure

```
├── grammar.js          # Tree-sitter grammar definition
├── src/                # Generated parser code
├── queries/            # Helix query files
│   ├── highlights.scm  # syntax highlighting
│   ├── indents.scm     # indentation rules
│   ├── textobjects.scm  # text objects
│   ├── tags.scm        # code navigation
│   ├── rainbows.scm    # rainbow brackets
│   └── injections.scm  # language injection
└── test.bsn            # test file
```

## Local Development

```bash
# Generate parser
tree-sitter generate

# Test parsing
tree-sitter parse test.bsn

# Run tests
tree-sitter test
```

## BSN! Macro Highlighting in Rust

When using `bsn!` or `bsn_list!` macros in Rust files, you can get BSN syntax highlighting via language injection.

### Configuration Steps

1. Create/edit the Rust injection query file:

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

2. Restart Helix and open a Rust file to see highlighting for `bsn!` macro content.

### Example

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

## Links

- [Bevy Scene Notation Documentation](https://bsn.dev/)
- [Tree-sitter Documentation](https://tree-sitter.github.io/)
- [Helix Editor](https://helix-editor.com/)
