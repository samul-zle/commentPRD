# Safe-Room Aware Search And Read

Use this reference when the user asks whether C4 documents are filtered, whether the current session is in safe-room mode, or whether `km search` / `km get` should align with the official Citadel safe-room implementation.

## Data Source

The local `km` CLI uses the KM saferoom REST endpoints by default for search and single-document reads:

```bash
km search "keyword"
km get <docId>
km get <docId> --json
```

Under the hood the default path calls:

```bash
POST https://km.sankuai.com/api/citadelsearch/saferoom/content
GET  https://km.sankuai.com/api/docs/recent/safeRoom/<docId>?versionCheck=1
```

The local path passes `DAXIANG_SAFE_ROOM_TOKEN` as both `X-SafeRoom-Token` and `dx_sroom_token` when present. Without a safe-room token, the same saferoom endpoints run in non-safe-room mode: search does not return C4 results, and single-document reads still depend on the caller's document permissions.

The CLI can still bridge to the official Citadel CLI when exact official client behavior is required:

```bash
oa-skills citadel searchContent --keyword "keyword" --raw
oa-skills citadel getDocumentJson --contentId "<docId>" --raw
```

Use the bridge explicitly:

```bash
km search "keyword" --source official
km get <docId> --source official
km get <docId> --json --source official
```

The official CLI owns its own CIBA/SSO authentication flow, official warnings, and latest-step merge logic.

## Source Modes

`--source auto` is the default.

- `auto` uses native KM saferoom REST by default, whether or not `DAXIANG_SAFE_ROOM_TOKEN` is present.
- `--source local` also uses native KM saferoom REST.
- `--source official` always uses the official Citadel CLI and does not fall back.

You can set `KM_CITADEL_SOURCE=official` to force the official bridge for `auto` in the current process. Set `KM_CITADEL_SOURCE=local` to force the native saferoom REST path.

## C4 Behavior

Official behavior:

- Outside a safe room: search results do not include C4 documents. The official CLI may warn that C4 results are omitted.
- Inside a safe room: the non-safe-room C4 filter is not applied, but document permission checks still apply.
- Single-document reads use official `getDocumentJson`; C4 access still depends on the safe-room token and the caller's document permissions.

Native saferoom REST follows the same server-side access-control boundary: do not locally filter C4 by fetching documents and inspecting secret level. Let the KM saferoom endpoint decide visibility.

Current native REST limitation: it does not merge uncommitted/latest editing steps. Use `--source official` only when that full official latest-step behavior is required and the CIBA flow is acceptable.

## Operational Notes

- The official CLI may require CIBA authorization unless an auth token/cache is already available.
- The native saferoom REST path uses existing SSO cookies through the local request client and does not invoke the official CLI CIBA flow.
- Do not print or log safe-room tokens. The bridge redacts `DAXIANG_SAFE_ROOM_TOKEN` from subprocess error text.
- CLI stdout remains compatible with existing `km` output: search returns the existing list shape, `km get` prints Markdown, and `km get --json` prints the ProseMirror JSON body. Diagnostics stay out of stdout.
