# EAA-Cloud

This repository contains small, self-hosted utilities:

1. **PDF stamping** — add a reference / tracking ID to scanned PDF documents.
2. **Power Apps YAML validation** — validate Power Apps YAML against a schema.

## PDF stamping (scanned documents)

`scripts/stamp_pdf.py` stamps a reference or tracking ID onto a PDF. It is a
**decisive, seamless, zero-cost** solution:

- **Zero cost** — uses only the free, open-source `pypdf` and `reportlab`
  libraries. No paid APIs, cloud services, or per-document fees.
- **Works on scanned PDFs** — the ID is drawn as a transparent overlay and
  merged on top of every page, so it works even on image-only scans with no
  text layer.
- **Seamless** — a single command; if you don't supply an ID, a unique one is
  generated automatically. Handles multi-page and rotated (scanned) pages.
- **Searchable** — the stamp is real text, so the reference is selectable and
  searchable in the output PDF.

### Install

```bash
pip install -r requirements.txt
```

### Usage

```bash
# Auto-generate a tracking ID (e.g. REF-20260730-A1B2C3), stamp bottom-right.
# Writes <input>-stamped.pdf next to the input.
python scripts/stamp_pdf.py scan.pdf

# Provide your own reference and choose where it goes.
python scripts/stamp_pdf.py scan.pdf --id "REF-2026-00042" --position top-right

# Full control over the output path and appearance.
python scripts/stamp_pdf.py scan.pdf \
    -o stamped.pdf \
    --id "TRK-000123" \
    --position bottom-right \
    --font-size 12 \
    --color "#B00020" \
    --opacity 0.85 \
    --pages "1,3,5-8"
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `input` | — | Path to the input PDF (scanned or digital). |
| `-o, --output` | `<input>-stamped.pdf` | Output path. |
| `--id` | auto-generated | The reference / tracking ID to stamp. |
| `--prefix` | `REF` | Prefix used when auto-generating an ID. |
| `--position` | `bottom-right` | `top-left`, `top-right`, `bottom-left`, `bottom-right`, or `center`. |
| `--font-size` | `10` | Font size in points. |
| `--font-name` | `Helvetica-Bold` | A built-in PDF font name. |
| `--color` | `#B00020` | Stamp color as `#rrggbb`. |
| `--opacity` | `0.85` | `0.0` (clear) to `1.0` (solid). |
| `--margin` | `18` | Distance from the page edge, in points. |
| `--pages` | all | 1-based pages to stamp, e.g. `1,3,5-8`. |

## Power Apps YAML validation

`scripts/validate_yaml.py` validates Power Apps YAML files against
`powerapps-schema.yaml`:

```bash
python scripts/validate_yaml.py powerapps-schema.yaml
```

This also runs in CI via `.github/workflows/validate.yml`.
