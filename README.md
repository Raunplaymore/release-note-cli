# release-note-cli

Git 커밋 로그에서 릴리스 노트를 자동 생성하는 CLI.
[Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따르는 커밋을 파싱해서 카테고리별로 정리해줍니다.

## Install

```bash
npm install -g release-note-cli
```

## Usage

```bash
# 두 태그 사이 릴리스 노트 생성
notes gen v1.0.0 v1.1.0

# 특정 ref부터 HEAD까지
notes gen v1.0.0

# 마지막 태그부터 HEAD까지
notes latest

# 텍스트 포맷으로 출력
notes gen v1.0.0 v1.1.0 -o text

# CHANGELOG.md에 추가
notes latest -a
```

## Output Example

```markdown
## v1.1.0 (2026-02-26)

### Features
- **auth:** add Google OAuth login (a1b2c3d)
- implement dark mode toggle (d4e5f6g)

### Bug Fixes
- **api:** fix token refresh race condition (h7i8j9k)

### Breaking Changes
- **config:** rename apiUrl to apiBase (l0m1n2o)
```

## Supported Commit Types

| Type | Category |
|------|----------|
| `feat` | Features |
| `fix` | Bug Fixes |
| `docs` | Documentation |
| `refactor` | Refactoring |
| `perf` | Performance |
| `style`, `test`, `chore`, `ci`, `build` | Other Changes |

`BREAKING CHANGE:` in body 또는 `feat!:` 형태의 `!` 접미사는 Breaking Changes로 분류됩니다.

## Commands

| Command | Description |
|---------|-------------|
| `notes gen <from> [to]` | 두 git ref 사이의 릴리스 노트 생성 |
| `notes latest` | 마지막 태그 → HEAD 릴리스 노트 생성 |

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `-o, --output <format>` | 출력 포맷 (`markdown` / `text`) | `markdown` |
| `-a, --append` | CHANGELOG.md에 추가 | `false` |

## Support

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/pmpt_cafe)

## License

MIT
