# Complete technical implementation

This chapter defines the expanded implementation surface of the DGO Design System. It is limited to design, interaction, accessibility, responsive behaviour, internationalisation, visualisation, performance and integration quality.

## Added capabilities

- Safe global `:focus-visible` fallback plus component focus rings.
- Enforced comfortable and compact interactive target variables.
- Direction-safe drawer motion and logical layout primitives.
- Dependency-free declarative runtime for modal focus containment, return focus, tabs, accordion, segmented controls, file upload and toast delivery.
- New accordion, segmented control, file-upload, timeline, chart shell and sticky action-bar families.
- Responsive dashboard, detail and form composition patterns.
- Print, forced-colours and reduced-motion completion layer.
- Progressive enhancement: semantic HTML remains usable when JavaScript is unavailable.
- Structured conformance manifest and executable static validator.

## Integration

Load the enhancement token file after the existing themes, then load the enhancement stylesheet after the component library. Load the runtime with `defer`.

```html
<link rel="stylesheet" href="tokens/tokens.enhanced.css">
<link rel="stylesheet" href="styles/enhancements.css">
<script src="scripts/dgo-runtime.js" defer></script>
```

## Runtime API

```js
DGO.openModal(document.querySelector('#route-dialog'), trigger);
DGO.closeModal(document.querySelector('#route-dialog'));
DGO.showToast('Record routed successfully', { tone: 'success' });
DGO.init(fragment);
```

## Quality contract

1. Every interactive component remains keyboard operable.
2. Every state is represented by native semantics or ARIA state.
3. Visual state is never communicated by colour alone.
4. Motion collapses under reduced-motion preferences.
5. Components remain distinguishable in forced colours.
6. Directional behaviour follows the document direction.
7. Tables preserve native table semantics and scroll rather than restructure destructively.
8. User-provided filenames and messages are inserted with `textContent`, not HTML.
9. The runtime is dependency-free and safe from `file://` execution.
10. Consumers can listen for `dgo:*` custom events without replacing core behaviour.
