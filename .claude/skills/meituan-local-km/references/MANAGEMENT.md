# Document Management Workflows

Operational guide for KM directory governance and document creation.

## Workflow 1: Manage Directory Structure

Use this workflow for large-scale space cleanup and taxonomy governance.

### Step 1: Build directory context

```bash
# Inspect a space tree
km hierarchy-info --space-id <SPACE_ID>

# Inspect neighborhood of a specific document
km hierarchy-info --doc-id <DOC_ID>
```

### Step 2: Identify candidates for reorganization

```bash
# Search by title/content keyword
km search "keyword" --space-id <SPACE_ID> --limit 100

# Read lightweight markdown for quick review
km get <DOC_ID>
```

Sort and decide by:
- Time (recent vs stale docs)
- Title naming consistency
- Author/ownership
- Content relevance and duplication

### Step 3: Execute management operations

```bash
# Copy before risky operations
km copy <DOC_ID> --title "Backup - <DOC_ID>"

# Move under another parent doc
km move <DOC_ID> --parent <NEW_PARENT_ID>

# Or move to a space root
km move <DOC_ID> --space <TARGET_SPACE_ID>

# Delete and restore
km delete <DOC_ID>
km restore <DOC_ID>
```

### Step 4: Validate final structure

```bash
km hierarchy-info --doc-id <DOC_ID>
km hierarchy-info --space-id <SPACE_ID>
```

## Workflow 2: Create Documents

`km create --file` writes directly to the KM 2.0 collaboration-doc endpoint and produces `/collabpage/<docId>`. Markdown is parsed Markdown-first; no CitadelMD `:::` macros are accepted.

### Step 1: Locate create target

- Under a parent document: `--parent <PARENT_DOC_ID>`.
- Under a space root: `--space <SPACE_ID>`.
- Neither: document goes to personal space (我的空间).
- Empty directory node (no body): omit `--content` and `--file` and pass `--parent` or `--space`. Result is a 1.0 page at `/page/<docId>`.

```bash
km create --title "Project Home" --space 98076
km create --title "Runbook" --parent 2708424384
km create --title "Scratch Notes"
```

### Step 2: Choose content input mode

| Mode | Command | When to use |
|---|---|---|
| Empty | `km create --title "Section"` | Directory/container node only |
| Inline | `km create --title "Quick Note" --content "# TL;DR\n\n- item"` | Small snippets, no local resources |
| File (preferred) | `km create --title "Release Plan" --file ./docs/release-plan.md --parent 2708424384` | Any doc that references local resources or is non-trivial |

When `--file` is used, the file's directory becomes the base path for resolving local resource references; relative paths inside the markdown are resolved against it.

### Step 3: Two-stage flow (automatic)

If the markdown contains any local image / drawIO / minder / attachment / audio / video reference, or a fenced `mermaid` / `minder` block, the CLI:

1. Creates an empty 2.0 collab doc to obtain `docId`.
2. Uploads each local asset to that `docId` (image → `/api/file/uploadphoto`; drawIO/minder/attachment → `/api/file/upload`; audio/video → `/api/file/uploadMedia`; mermaid → `/api/open/attachment/create` + mermaid upload).
3. Replaces the doc body with the final ProseMirror JSON via `/api/pages/updateCollaborationContent/<docId>`.

Plain-text markdown with no uploadable resources is created in one shot, no upload phase.

> If upload fails partway, the empty placeholder doc currently remains under the parent — clean it up with `km delete <docId>` and rerun.

### Step 4: Supported markdown surface

Reference: [km_extended_markdown.md](../assets/km_extended_markdown.md). High level:

| Category | Markdown source | KM 2.0 node |
|---|---|---|
| Headings | ATX `# … ######`, Setext `===`/`---` | `heading` |
| Inline marks | `**b** *i* ~~s~~ \`c\` ==hi== ^sup^ ~sub~ `, `<u>`/`<sup>`/`<sub>` | `strong`/`em`/`strikethrough`/`code`/`backgroundcolor`/`sup`/`sub`/`underline` marks |
| Links | inline `[t](u "title")`, reference `[t][ref]` + `[ref]: …`, autolink `<https://…>`, bare URL, email | `link` |
| Mentions | bare `@<mis>` | `mention` (resolved via `/api/users?mis=…&tenantId=1`); unresolved stay as text |
| Code | fenced ``` ``` / ~~~ / ```` ```` with language hint | `code_block` (language enum maps to KM names) |
| Diagrams (code blocks) | ` ```plantuml `, ` ```mermaid `, ` ```minder ` / ` ```mindmap ` | `plantuml`, `open_iframe` (mermaid attachment), `minder` (rendered to SVG) |
| Math | inline `$…$`, block `$$…$$` | `latex_inline`, `latex_block` |
| Quotes | `> quote` | `blockquote` |
| Lists | unordered / ordered / `- [ ]` task / nested | `bullet_list` / `ordered_list` / `task_list` |
| Tables | pipe tables with alignment, escaped `\|`, inline-code `\| ` | `table` with calculated column widths |
| Footnotes | `text[^a]` + `[^a]: …` | `footnote` + `footnote_list` |
| Collapse | `<details>[ open]<summary>title</summary>…</details>` | `collapse` (`active=true` for `open`) |
| Hard break | trailing `\` or two trailing spaces | `hard_break` |
| Images | `![alt](./img.png "title")`, reference image | `image` (uploaded) |
| DrawIO | `![alt](./flow.drawio)` or `![alt](./flow.drawio.svg)` | `drawio` (editable SVG/CDN) |
| Minder | `![alt](./mind.minder.svg)` or fenced ` ```minder ` outline | `minder` (uploaded SVG) |
| Attachments | standalone `[label](./spec.pdf "title")` | `attachment` |
| Audio | standalone `[label](./voice.mp3 "title")` | `audio` |
| Video | standalone `[label](./demo.mp4 "title")` | `video` |
| Indented paragraphs | 4/8-space indented text | `paragraph` with `indent`=1/2 |

Local path styles accepted: relative, absolute, `~/…`, `file://…`. See [create_media_paths_template.md](../assets/create_media_paths_template.md).

### Step 5: Verify after create

```bash
# Inspect the created doc as ProseMirror JSON
km get <docId> --json > /tmp/created.json

# Confirm expected nodes are present (heading/mention/image/drawio/minder/plantuml/open_iframe/attachment/audio/video/table/footnote/collapse/code_block ...)
jq '[.. | objects | select(.type) | .type] | unique' /tmp/created.json
```

### Constraints and non-goals

- **No CitadelMD input syntax.** `:::drawio`, `:::plantuml`, `:::mermaid`, `:::minder`, `:::xmind`, `:::data2chart`, `:::note`, `:::html`, `:::page_tree`, `:[mention]{…}`, `:[color]{…}` etc. are treated as plain text. Do not paste them into the source markdown.
- **No `.xmind` support.** `.xmind` files are not uploaded or rendered (an `[Unsupported file type: …]` placeholder is emitted).
- **No Data2Chart / HTML macro / KM note / collab-comment authoring.** These KM-native macros cannot be authored from Markdown in this version.
- **HTML allow-list.** Only `<u>`, `<sup>`, `<sub>` inline tags and the `<details><summary>…</summary>…</details>` block are recognized. Other HTML is left as escaped text.
- **Remote resources stay remote.** Remote `http(s)://` images become an inline placeholder; remote audio/video/attachment links stay as plain links.
- **Standalone block resources.** Attachment / audio / video uploads only fire when `[label](./file.ext)` is the sole content of its line (standalone). Inline use becomes a regular link.

## Capability Matrix

| Goal | Command | Notes |
|---|---|---|
| Inspect space tree | `km hierarchy-info --space-id <spaceId>` | Build directory map before reorg |
| Inspect doc neighborhood | `km hierarchy-info --doc-id <docId>` | Confirm parent/children/siblings |
| Search docs | `km search "keyword" --space-id <spaceId>` | Find candidate docs by title/content |
| Create empty directory node | `km create --title "Doc" --parent <parentId>` | 1.0 page at `/page/<docId>` |
| Create from markdown text | `km create --title "Doc" --content "# Title"` | Inline only; no local resources |
| Create 2.0 doc from markdown file | `km create --title "Doc" --file ./doc.md --parent <parentId>` | Produces `/collabpage/<docId>`; local resources resolved from the file's directory |
| Copy doc | `km copy <docId> --title "Backup"` | Backup before move/delete |
| Move doc | `km move <docId> --parent <parentId>` | Reorganize structure |
| Delete doc | `km delete <docId>` | Move to recycle bin |
| Restore doc | `km restore <docId>` | Recover deleted doc |

## Guardrails

- For bulk cleanup, always run `copy -> move/delete` to preserve rollback.
- Verify target parent/space before move.
- Keep operation logs (docId/action/time) for batch jobs.
- Use JSON output (`km -f json ...`) for automation.

## Boundary

This reference focuses on directory/document management and markdown-based creation.

For node-level editing and diagram editing in existing docs, use:
- `kmedit` skill
- `kmdrawio` skill
