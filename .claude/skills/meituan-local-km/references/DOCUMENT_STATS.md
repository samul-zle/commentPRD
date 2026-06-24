# Official Citadel Document Statistics

Use this reference when the user asks for KM document statistics, metadata, owner/creator information, personal space IDs, or a space root document list.

These workflows use the official CLI:

```bash
oa-skills citadel <command> ...
```

Do not route these requests to the local `km` CLI. The local CLI can inspect hierarchy with `km hierarchy-info`, but it does not expose official stats such as views, favorites, comments, creation duration, owner, or modifier.

## Prerequisite

Check that the official CLI is available:

```bash
command -v oa-skills >/dev/null || npm install -g @it/oa-skills --registry=http://r.npm.sankuai.com
```

## URL / ID Rules

For document statistics and metadata, extract the content ID from:

- `https://km.sankuai.com/collabpage/<id>`
- `https://km.sankuai.com/page/<id>`
- a pure numeric content ID

Pass the extracted ID as `--contentId`.

## Document Stats

Use `getDocumentStats` for usage and engagement data:

```bash
oa-skills citadel getDocumentStats --contentId "<id>"
```

Expected business fields include:

- follower count
- favorite count
- unique viewer count
- view count
- comment count
- creation duration

Return a concise summary to the user. Do not paste large raw JSON unless the user explicitly asks for raw output.

## Document Metadata

Use `getDocumentMetaInfo` for document ownership and location metadata:

```bash
oa-skills citadel getDocumentMetaInfo --contentId "<id>"
```

Expected business fields include:

- `contentId`
- title
- creator
- owner
- last modifier
- create time
- modify time
- space ID
- parent document ID and parent link when visible

If `parentId` is `0`, explain that the document is either at the space root or the current user does not have permission to view the parent.

## Personal Space ID By MIS

Use `getSpaceIdByMis` when the user asks for a user's personal KM space ID:

```bash
oa-skills citadel getSpaceIdByMis --targetMis "<mis>"
```

## Space Root Documents

Use `getSpaceRootDocs` when the user asks for documents at a KM space root:

```bash
oa-skills citadel getSpaceRootDocs --spaceId "<space-id>"
```

The result may include title, document ID, link, type, creator, and create time. If the official CLI returns a warning about incomplete data due to C4/safe-house restrictions, show that warning to the user.

## Related Local Command

For parent/children/siblings or a full tree, prefer the local command:

```bash
km hierarchy-info --doc-id <docId>
km hierarchy-info --space-id <spaceId>
```

Use official metadata commands when the user specifically needs owner, creator, modifier, timestamps, stats, or parent visibility details.
