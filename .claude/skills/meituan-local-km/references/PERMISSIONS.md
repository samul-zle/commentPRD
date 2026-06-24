# Official Citadel Permission Management

Use this reference when the user asks to audit or change KM permissions. These workflows intentionally use the official CLI:

```bash
oa-skills citadel <command> ...
```

Do not route these requests to the local `km` CLI; it does not implement permission governance.

## Prerequisite

Check that the official CLI is available before running permission commands:

```bash
command -v oa-skills >/dev/null || npm install -g @it/oa-skills --registry=http://r.npm.sankuai.com
```

## Target Rules

Prefer the full KM URL when the user provides one.

| User input | Pass to CLI |
|---|---|
| `https://km.sankuai.com/collabpage/<id>` | `--url "https://km.sankuai.com/collabpage/<id>"` |
| `https://km.sankuai.com/page/<id>` | `--url "https://km.sankuai.com/page/<id>"` |
| `https://km.sankuai.com/xtable/<id>` | `--url "https://km.sankuai.com/xtable/<id>"` |
| Pure numeric content ID | `--pageId "<id>"` |
| `https://km.sankuai.com/space/<key-or-id>` | `--url "https://km.sankuai.com/space/<key-or-id>"` |

Do not pass both `--url` and `--pageId`. `space-admin` only accepts a space URL.

## Intent Routing

| User intent | Official command |
|---|---|
| Audit permissions for a doc, directory, or space | `audit` |
| Grant permissions to people, departments, groups, mail lists, apps, or account types | `grant` |
| Change existing permissions | `modify` |
| Remove explicit permissions | `revoke` |
| Remove or restore permission inheritance | `inherit` |
| Audit docs created by resigned employees | `audit-resigned` |
| Transfer document owner in bulk | `transfer-owner` |
| Clear explicit permissions and keep only owners/admins | `clear-perm` |
| Set "anyone with link" sharing permission | `share-perm` |
| Add or remove space admins | `space-admin` |

## Safety Rules

- `audit` and `audit-resigned` create a KM report document. Tell the user before running them.
- `grant`, `modify`, `revoke`, and `clear-perm` create a local permission backup under `~/.cache/oa-skills/perm-backups/`.
- `clear-perm` is high risk. Explicitly confirm with the user because it clears all explicit permissions except owners and space admins, and attempts to close link sharing.
- Directory targets are recursive for `grant`, `modify`, `revoke`, `inherit`, `clear-perm`, and `share-perm`.
- `share-perm` does not apply to KM 1.0 documents; the official CLI skips unsupported documents.

## Common Commands

Audit permissions:

```bash
oa-skills citadel audit \
  --url "https://km.sankuai.com/collabpage/<id>"
```

Audit with filters:

```bash
oa-skills citadel audit \
  --url "https://km.sankuai.com/space/<space-key-or-id>" \
  --secret-level 3 \
  --start-time "2024-01-01" \
  --end-time "2024-12-31" \
  --creators "zhangsan,lisi"
```

Grant permissions:

```bash
oa-skills citadel grant \
  --url "https://km.sankuai.com/collabpage/<id>" \
  --person "lisi,wangwu" \
  --perm "可编辑"
```

Supported `--perm` values:

- `仅浏览`
- `可浏览、评论`
- `可编辑`
- `可编辑、添加`
- `可编辑、添加、删除`
- `可管理`

Grant to a DX group:

```bash
oa-skills citadel grant \
  --url "https://km.sankuai.com/collabpage/<id>" \
  --xm-group-ids "<group-id>" \
  --perm "仅浏览"
```

Grant to a department:

```bash
oa-skills citadel grant \
  --url "https://km.sankuai.com/collabpage/<id>" \
  --dept "美团/到店事业群/商业技术部" \
  --org-roles "技术" \
  --contract-types "101" \
  --perm "仅浏览"
```

Modify or revoke permissions:

```bash
oa-skills citadel modify \
  --url "https://km.sankuai.com/collabpage/<id>" \
  --person "lisi" \
  --perm "可管理"

oa-skills citadel revoke \
  --url "https://km.sankuai.com/collabpage/<id>" \
  --person "lisi"
```

Permission inheritance:

```bash
oa-skills citadel inherit \
  --url "https://km.sankuai.com/collabpage/<id>" \
  --action remove

oa-skills citadel inherit \
  --url "https://km.sankuai.com/collabpage/<id>" \
  --action restore \
  --keep-existing false
```

Transfer owner:

```bash
oa-skills citadel transfer-owner \
  --url "https://km.sankuai.com/space/<space-key-or-id>" \
  --target-mis "lisi"
```

Clear permissions:

```bash
oa-skills citadel clear-perm \
  --url "https://km.sankuai.com/collabpage/<id>"
```

Link sharing:

```bash
oa-skills citadel share-perm \
  --url "https://km.sankuai.com/collabpage/<id>" \
  --status 1 \
  --perm 5

oa-skills citadel share-perm \
  --url "https://km.sankuai.com/collabpage/<id>" \
  --status 0
```

`share-perm --perm` values:

- `5`: only view
- `0`: view and comment
- `1`: edit

Space admins:

```bash
oa-skills citadel space-admin \
  --url "https://km.sankuai.com/space/<space-key-or-id>" \
  --action add \
  --person "lisi,wangwu"

oa-skills citadel space-admin \
  --url "https://km.sankuai.com/space/<space-key-or-id>" \
  --action remove \
  --person "lisi"
```

## DX Group Creation Follow-up

If a KM document was created for a DX group, grant access after creation:

```bash
oa-skills citadel grant \
  --url "https://km.sankuai.com/collabpage/<new-doc-id>" \
  --xm-group-ids "<group-id>" \
  --perm "仅浏览"

oa-skills citadel grant \
  --url "https://km.sankuai.com/collabpage/<new-doc-id>" \
  --person "<admin-mis>" \
  --perm "可管理"
```
