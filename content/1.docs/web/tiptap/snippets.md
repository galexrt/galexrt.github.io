---
title: Snippets
---

A collection of useful Tiptap editor snippets for various functionalities and customizations.

Most snippets are based on the [Tiptap Documentation](https://tiptap.dev/) and were created with version `v3` and higher in mind.

## Insert Content At End Of Document

```typescript
const editor = useTiptapEditor(); // Your Tiptap editor instance

const end = editor.$doc.content.size || 0; // Sane-ish fallback in case the document is empty or doc is "undefined"

editor?.commands.insertContentAt(
    end, // Position
    '<p>Your content here</p>', // Can be plain text, raw HTML or JSON node(s).
);
```

See [Tiptap Documentation: Commands - insertContentAt](https://tiptap.dev/docs/editor/api/commands/content/insert-content-at).
