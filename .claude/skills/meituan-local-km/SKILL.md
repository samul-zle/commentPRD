---
name: meituan-local-km
description: Meituan Knowledge Management (学城) document read, create, and management operations (search/get/create/delete/move/copy/restore), including doc search by space IDs, space search, and km create extended Markdown such as km-html native HTML macro / HTML 信息图 / HTML 看板. Trigger this skill when user input contains KM links under km.sankuai.com (e.g., /collabpage/<docId> or /page/<docId>), pasted KM content, or asks to create KM docs with km-html macros.

metadata:
  skillhub.creator: "pingxumeng"
  skillhub.updater: "pingxumeng"
  skillhub.version: "V8"
  skillhub.source: "FRIDAY Skillhub"
  skillhub.skill_id: "4634"
  skillhub.high_sensitive: "true"
---

# Meituan Knowledge Management (学城) Skill

## km-html 选路

| 目标 | 用法 | 是否需浏览器 |
|---|---|---|
| 新建文档时插入 HTML 宏/信息图/看板 | `km create --file` 里写 <code>```km-html</code> | 否 |
| 改已有宏 / 精确节点定位插入 | `kmedit apply`（`insert_html` / `edit_html`） | 是（CDP） |

新建文档优先走本 skill 的 `km create --file`；更新已有 HTML 宏再转 `kmedit`。信息图和看板生成规范分别见 `km-infographic`、`km-html-dashboard`。

## Installation
- Install latest published CLI: `UV_INDEX_URL=https://pypi.sankuai.com/simple/ uv tool install mt-km-cli`
- Upgrade to latest published CLI: `UV_INDEX_URL=https://pypi.sankuai.com/simple/ uv tool upgrade mt-km-cli`
- Verify installed version: `km --version`

This skill tracks the latest published `mt-km-cli` from Meituan PyPI, not the current repository HEAD.


Use this skill for KM document reading, navigation, and lifecycle management.

## Trigger Scenarios

Use this skill when user intent is about:
- searching KM docs or spaces
- reading KM doc content (markdown or full JSON)
- inspecting directory tree under doc/space
- creating docs or organizing doc directories (copy/move/delete/restore)
- creating docs from extended Markdown, including `km-html` native HTML macro fences for browserless HTML infographics or dashboards
- updating an existing document in place through official CitadelMD / CitadelXML full-document workflows
- viewing personal KM activity (browsing history, recent edits, favorites, quick access, @-mentions, received docs, comments)
- auditing or changing KM permissions, link sharing, ownership, or space admins through the official Citadel CLI
- fetching official document statistics or metadata such as views, comments, owner, creator, parentId, and edit times

## Trigger Timing

Trigger this skill immediately when either of the following appears in user input:
- the user pastes a KM link whose domain is `km.sankuai.com` (for example `https://km.sankuai.com/collabpage/<docId>` or `https://km.sankuai.com/page/<docId>`)
- the user pastes KM document content, KM search results, or KM hierarchy output and asks to read/summarize/analyze/manage it

Do not wait for explicit mention of "use meituan-km"; KM URL/content is sufficient trigger evidence.

**Do NOT trigger** if:
- The user wants precise editor-native node operations, partial paste, table semantics, comments, or rich macro editing in an existing KM doc (use `kmedit` skill instead).

Keep this skill when the user explicitly asks for official CitadelMD/CitadelXML full-document update.

**Use together with other skills:**
- Creating a doc that includes drawIO diagrams: use `kmdrawio` first to generate the `.drawio`/`.svg` file, then use this skill to create the doc with a local file reference.

## Boundaries

- Precise editor-native updates of existing docs → `kmedit`.
- Full-document in-place updates with CitadelMD/CitadelXML → official `oa-skills citadel` CLI in this skill.
- Standalone drawIO diagram generation/conversion → `kmdrawio`.
- This skill focuses on search/read/lifecycle management; use `kmdrawio` as a prerequisite when doc creation requires diagrams.
- Permission management and document statistics are not provided by the local `km` CLI. Use the official `oa-skills citadel` CLI; see [Permission Management](references/PERMISSIONS.md) and [Document Statistics](references/DOCUMENT_STATS.md).
- Search/read use KM saferoom REST by default; route through the official Citadel CLI with `--source official` only when exact official client behavior is required. See [Safe-Room Aware Search And Read](references/SAFE_ROOM.md).

## Quick Start

> **Prerequisite**: Ensure your browser is logged into 学城 before running any command.
> First-time setup: https://km.sankuai.com/collabpage/2708424384

> **Always run `km --help` first** to discover the full command set and options, then use `km <subcommand> --help` for details.

1. Discover command usage:
   - `km --help`
2. Locate target docs/spaces:
   - `km search "keyword" --limit 10`
   - `km search-space "keyword" --limit 10`
3. Read or manage:
   - `km get <docId>`
   - `km hierarchy-info --doc-id <docId>`
   - `km create --title "New Doc"`

## Workflow 1: Search Documents

Use this workflow for global search and space-scoped search.

Global search (minimal):

```bash
km search "API documentation" --limit 10
```

Search within specific 学城 spaces:

```bash
km search "mcp" --space-id 98076 --space-id 38556
```

Search spaces by keyword:

```bash
km search-space "基础技术部文档" --limit 5
```

## Workflow 2: Read Document Content

Use this workflow when deciding between markdown output and full ProseMirror JSON.

Read markdown (default, lightweight):

```bash
km get 1234567
```

Read full ProseMirror JSON (complete structure, heavy payload):

```bash
km get 1234567 --json > /tmp/km_doc.json
```

Markdown mode notes:
- Lightweight; suitable for most reading and summarization tasks.
- Conversion may be incomplete for complex structures (e.g. nested tables, custom blocks).

JSON mode notes:
- Output is complete but often very large; do **not** load the full file directly into context.
- Use `jq` or scripts to extract only the needed nodes/fields.
- For inline file URLs found in JSON content, fetch with `mtcurl "<url>"`.
- For DrawIO diagrams (`"type":"drawio"` nodes), extract the `attrs.src` URL and change `contentType=0` to `contentType=1`, then fetch with `km read-file "<url>"` to get readable SVG content.

Read embedded file content by URL:

```bash
km read-file "https://km.sankuai.com/api/file/12345/diagram.png" --compression 3
```

Read DrawIO diagram as SVG (change `contentType=0` → `contentType=1`):

```bash
# From km get <docId> --json, find nodes with "type":"drawio", extract attrs.src
# Change contentType=0 to contentType=1 in the URL
km read-file "https://km.sankuai.com/api/file/cdn/<docId>/<fileId>?contentType=1&isNewContent=false"
```

## Workflow 3: Update Existing Document In Place

For full-document updates with official CitadelMD or CitadelXML syntax, use [CitadelMD In-Place Edit](references/CITADELMD_IN_PLACE_EDIT.md). Keep the main rule simple: fetch latest content to a local file, make the minimal edit, validate, then write back with `--step-version`.

Prefer CitadelXML for complex 2.0 edits. Use CitadelMD when the user explicitly asks for CitadelMD syntax or when a 1.0 document cannot use XML.

## Workflow 4: Find Document Directory Tree

Use this workflow to inspect parent/child/sibling relationships or browse a space tree.

By document id:

```bash
km hierarchy-info --doc-id=2708424384
```

By space id (for full space tree):

```bash
km hierarchy-info --space-id=98076
```

## Read Capability Matrix

| Goal | Command | Notes |
|---|---|---|
| Search docs | `km search "keyword" --limit 20 --page 1` | Full-text search in KM |
| Search docs by spaces | `km search "keyword" --space-id 98076 --space-id 38556` | Filter document search to specific KM spaces |
| Safe-room aware search | `km search "keyword"` | Uses KM saferoom REST; non-safe-room mode omits C4, safe-room mode relies on safe-room token and doc permissions |
| Search spaces | `km search-space "keyword" --limit 20 --page 1` | Search KM spaces and return `spaceId` + `spaceName` |
| Get markdown | `km get <docId>` | Lightweight output, suitable for most reading tasks |
| Safe-room aware read | `km get <docId>` | Uses KM saferoom REST and preserves local Markdown output shape; does not merge uncommitted editing steps |
| Get full JSON tree | `km get <docId> --json` | Complete structure; use `jq`/scripts for targeted queries |
| Inspect hierarchy | `km hierarchy-info --doc-id=<docId>` | Parent/children/sibling structure |
| Read embedded file | `km read-file "<url>" --compression 3` | Image/SVG/file content |
| Read DrawIO diagram | `km read-file "<src with contentType=1>"` | Find `"type":"drawio"` node in `--json` output, change `contentType=0` → `contentType=1` in `attrs.src` URL |

## Workflow 5: Personal KM Activity

Use this workflow for browsing history, recent edits, favorites, and other personal document views.

```bash
km my history               # 浏览历史 — recently viewed docs
km my edits                 # 最近编辑 — recently edited docs
km my favorites             # 我的收藏 — bookmarked docs
km my quick-access          # 快速访问 — pinned docs
km my mentioned             # 提到我的 — docs that @-mention you
km my received              # 大象收到的 — docs received via DX
km my comments              # 我评论的 — docs you commented on
```

Pagination: `km my history --limit 10 --page 2`

## Personal Activity Capability Matrix

| Goal | Command | Notes |
|---|---|---|
| Browsing history | `km my history` | Recently viewed documents |
| Edit history | `km my edits` | Recently edited documents |
| Favorites | `km my favorites` | Bookmarked/collected documents |
| Quick access | `km my quick-access` | Pinned quick-access documents |
| @-mentions | `km my mentioned` | Documents where you were @-mentioned |
| Received via DX | `km my received` | Documents shared via 大象 |
| My comments | `km my comments` | Documents you commented on |

## Management Capability Matrix

For detailed directory governance and creation workflows, see [MANAGEMENT.md](references/MANAGEMENT.md).

| Goal | Command | Notes |
|---|---|---|
| Create empty directory node | `km create --title "New Doc" --parent <parentId>` | No `--content/--file` → 1.0 directory node at `/page/<docId>` |
| Create from markdown text | `km create --title "Doc" --content "# Title"` | Inline only; keep snippets small |
| Create 2.0 doc from markdown file | `km create --title "Doc" --file ./doc.md --parent <parentId>` | **Preferred**. Produces `/collabpage/<docId>`. Local resources are uploaded relative to the file's directory. |
| Copy doc | `km copy <docId> --title "Copy"` | Duplicate existing doc |
| Move doc | `km move <docId> --parent <parentId>` | Reorganize hierarchy |
| Delete doc | `km delete <docId>` | Move to recycle bin |
| Restore doc | `km restore <docId>` | Recover from recycle bin |

> **`km create --file` produces a 2.0 collabpage.** Markdown is parsed Markdown-first and converted to native KM nodes: heading/list/table/code/footnote/collapse, image, drawIO, minder mind map, PlantUML, Mermaid, `km-html` native HTML macro, attachment, audio, video, `@mis` mention, LaTeX. Resource-bearing docs are auto-created in two stages (empty doc → upload assets → update content).

> **HTML macro quick start.** New docs can include <code>```km-html</code> fences to create native HTML macro nodes for infographics/dashboards without browser automation; `km create --syntax` prints the syntax and constraints.

> **Local resources only.** Image / drawIO / minder / attachment / audio / video references must be local paths (relative, absolute, `~/`, or `file://`). Remote `http(s)://` resource URLs are not uploaded and become an inline placeholder.

Use plain Markdown + the syntaxes listed in [km_extended_markdown.md](assets/km_extended_markdown.md).

## Official Citadel CLI Workflows

Some KM administration data is only available through the official Citadel CLI, not through this repository's local `km` command.

| Goal | Reference | Official command family |
|---|---|---|
| Update a document in place using CitadelMD syntax | [CitadelMD In-Place Edit](references/CITADELMD_IN_PLACE_EDIT.md) | `oa-skills citadel getDocumentCitadelMd/updateDocumentByMd/convertMdToJson` |
| Audit permissions, grant/revoke/modify permissions, inheritance, ownership transfer, link sharing, space admins | [Permission Management](references/PERMISSIONS.md) | `oa-skills citadel audit/grant/modify/revoke/inherit/...` |
| Get document stats, metadata, personal space ID, or space root docs | [Document Statistics](references/DOCUMENT_STATS.md) | `oa-skills citadel getDocumentStats/getDocumentMetaInfo/...` |


## Troubleshooting

If you encounter issues, check the FAQ or leave a message at the [meituan-km setup page](https://km.sankuai.com/collabpage/2708424384).

## Advanced References

- **[Document Management](references/MANAGEMENT.md)**
- **[CitadelMD In-Place Edit](references/CITADELMD_IN_PLACE_EDIT.md)**
- **[Permission Management](references/PERMISSIONS.md)**
- **[Document Statistics](references/DOCUMENT_STATS.md)**
- **[Safe-Room Aware Search And Read](references/SAFE_ROOM.md)**
