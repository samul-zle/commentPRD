# KM Media Path Template

Verifies local-resource path styles supported by `km create --file`. Paths resolve against the markdown file's own directory.

## DrawIO / SVG

```markdown
![DrawIO Relative](./assets/diagram.drawio)
![SVG Relative](./assets/diagram.drawio.svg)
![DrawIO Absolute](/tmp/diagram.drawio)
![DrawIO Home](~/km-assets/diagram.drawio)
![DrawIO File URI](file:///tmp/diagram.drawio)
```

## Minder (mind map)

Use a `.minder.svg` file produced by KM or a fenced ` ```minder ` text outline (see `km_extended_markdown.md`).

```markdown
![Roadmap Minder](./assets/roadmap.minder.svg)
```

## Images

```markdown
![PNG Relative](./assets/demo.png)
![JPEG Relative](./assets/demo.jpeg)
![WEBP Absolute](/tmp/demo.webp)
![GIF File URI](file:///tmp/demo.gif)
```

## Attachments (standalone link on its own line)

```markdown
[Spec PDF](./assets/spec.pdf "Specification")

[Quarterly Report](./assets/report.docx)

[Bundle](./assets/release.zip)
```

## Audio (standalone link on its own line)

```markdown
[Voice Memo](./assets/voice.mp3 "Owner walkthrough")

[Voice Backup](./assets/voice.wav)
```

## Video (standalone link on its own line)

```markdown
[Demo Walkthrough](./assets/demo.mp4 "Product demo")

[Recording](./assets/recording.mov)
```

## Notes

- Standalone means the markdown line contains **only** the `[label](path)` link — otherwise it becomes a regular link, not an attachment/audio/video node.
- Image references must use the `![alt](path)` syntax (with `!`).
- Remote `http(s)://` URLs are not uploaded. Remote images become an inline placeholder; remote attachment/audio/video links stay as plain links.
- `.xmind` files are not supported.
