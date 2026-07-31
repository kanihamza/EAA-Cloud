# EAA-Cloud — Complete Solution Documentation

**Document version:** 1.0
**Applies to repository:** `kanihamza/EAA-Cloud`
**Applies to branch:** `claude/pdf-stamp-scanned-t122bm`
**Last updated:** 2026-07-31

---

## Table of Contents

1. [Solution Overview](#1-solution-overview)
2. [Repository Inventory](#2-repository-inventory)
3. [System Requirements](#3-system-requirements)
4. [Dependency Specification](#4-dependency-specification)
5. [Installation Procedures](#5-installation-procedures)
6. [Component A — PDF Stamping Tool](#6-component-a--pdf-stamping-tool)
   - 6.1 [Functional Specification](#61-functional-specification)
   - 6.2 [Processing Pipeline](#62-processing-pipeline)
   - 6.3 [Complete CLI Parameter Reference](#63-complete-cli-parameter-reference)
   - 6.4 [Coordinate System and Positioning Specification](#64-coordinate-system-and-positioning-specification)
   - 6.5 [Colour and Transparency Specification](#65-colour-and-transparency-specification)
   - 6.6 [Page Selection Grammar](#66-page-selection-grammar)
   - 6.7 [Tracking ID Specification](#67-tracking-id-specification)
   - 6.8 [Output File Naming Specification](#68-output-file-naming-specification)
   - 6.9 [Rotation Handling Specification](#69-rotation-handling-specification)
   - 6.10 [Python API Reference](#610-python-api-reference)
   - 6.11 [Exit Codes](#611-exit-codes)
   - 6.12 [Complete Error Catalogue](#612-complete-error-catalogue)
   - 6.13 [Verified Behaviour Matrix](#613-verified-behaviour-matrix)
   - 6.14 [Complete `--help` Output](#614-complete---help-output)
7. [Component B — Power Apps YAML Validation](#7-component-b--power-apps-yaml-validation)
8. [CI/CD Configuration](#8-cicd-configuration)
9. [Operational Procedures](#9-operational-procedures)
10. [Security Specification](#10-security-specification)
11. [Performance Characteristics](#11-performance-characteristics)
12. [Limitations and Known Behaviours](#12-limitations-and-known-behaviours)
13. [Verification and Test Procedures](#13-verification-and-test-procedures)
14. [Troubleshooting Guide](#14-troubleshooting-guide)
15. [Glossary](#15-glossary)

---

## 1. Solution Overview

### 1.1 Purpose

The EAA-Cloud repository delivers two independent, self-hosted utilities:

| ID | Component | Purpose | Entry point |
|----|-----------|---------|-------------|
| **A** | PDF Stamping Tool | Applies a reference / tracking identifier onto every (or selected) page of a PDF document, including scanned image-only PDFs. | `scripts/stamp_pdf.py` |
| **B** | Power Apps YAML Validation | Validates YAML documents in the repository against a schema file. | `scripts/validate_yaml.py` |

Component A is the primary solution described by this document. Component B pre-existed in the repository and is documented in full for completeness.

### 1.2 Design Objectives (Component A)

The stamping tool was built against four explicit objectives, each with its concrete realisation:

| Objective | Realisation | Verification |
|-----------|-------------|--------------|
| **Zero cost** | Uses only `pypdf` (BSD-3-Clause) and `reportlab` (BSD-3-Clause). No paid API, no cloud service, no per-document licence, no network call at runtime. | Source contains no network client; dependency licences listed in §4.2. |
| **Works on scanned documents** | The identifier is rendered into a separate single-page PDF overlay and merged onto the target page. The tool never parses, OCRs or interprets existing page content. | Verified against a synthetic image-only PDF containing no text layer (§13.2). |
| **Seamless / decisive** | Single command, single required argument. All other parameters have working defaults. If no identifier is supplied, a unique one is generated automatically. | Verified: `python scripts/stamp_pdf.py scan.pdf` succeeds with no further input (§13.2). |
| **Traceable** | The stamp is real PDF text (not a raster image), therefore selectable, copyable and searchable in any PDF reader, and extractable programmatically for audit. | Verified via `pypdf` text extraction returning the exact stamped string (§13.2). |

### 1.3 Architectural Principle

The tool applies an **additive overlay composition** model:

```
┌──────────────────────────────┐
│  Input page (unmodified)     │  ← scanned raster, vector content, or both
│                              │
│   ┌───────────────────────┐  │
│   │  Overlay page         │  │  ← generated in memory by reportlab
│   │  (transparent, text)  │  │     contains ONLY the tracking ID
│   └───────────────────────┘  │
└──────────────────────────────┘
              ↓  merge_page(over=True)
┌──────────────────────────────┐
│  Output page                 │  original content preserved byte-for-byte
│                    REF-…-…   │  + tracking ID composited on top
└──────────────────────────────┘
```

Consequences of this model, all of which are guaranteed properties of the solution:

- Original page content is never re-encoded, re-compressed or degraded.
- The tool is content-agnostic: it works identically on scanned scans, digitally generated PDFs, and hybrid documents.
- No OCR engine, no image processing and no text-layer requirement.
- The operation is idempotent in structure but cumulative in effect: stamping an already-stamped file adds a second stamp (§6.13).

---

## 2. Repository Inventory

Complete list of every file in the solution, with its role.

| Path | Type | Role | Component |
|------|------|------|-----------|
| `README.md` | Markdown | Quick-start guide and option summary. | A + B |
| `DOCUMENTATION.md` | Markdown | This document — complete specification. | A + B |
| `requirements.txt` | pip requirements | Declares all runtime dependencies. | A + B |
| `scripts/stamp_pdf.py` | Python 3 executable | PDF stamping implementation and CLI. | A |
| `scripts/validate_yaml.py` | Python 3 executable | YAML schema validation implementation and CLI. | B |
| `powerapps-schema.yaml` | YAML | Schema file consumed by `validate_yaml.py`. | B |
| `.github/workflows/validate.yml` | GitHub Actions workflow | Continuous integration for Component B. | B |

There are no other source files, configuration files, environment files, secrets, or generated assets in the solution.

---

## 3. System Requirements

### 3.1 Runtime Requirements

| Requirement | Specification | Rationale / source |
|-------------|---------------|--------------------|
| **Python interpreter** | CPython **3.9 or later** | Lower bound imposed by dependencies: `pypdf` declares `Requires-Python: >=3.9`; `reportlab` declares `Requires-Python: >=3.9,<4`. |
| **Python upper bound** | Below 4.0 | Imposed by `reportlab` (`<4`). |
| **Verified interpreter** | CPython 3.11.15 | Version against which all behaviour in this document was executed and confirmed. |
| **CI interpreter** | CPython 3.11 | Pinned in `.github/workflows/validate.yml`. |
| **Operating system** | Any OS supported by CPython — Linux, macOS, Windows | The code uses `pathlib` exclusively for path handling; no OS-specific calls, no shell invocation, no subprocess. |
| **Architecture** | Any architecture with CPython wheels for `pillow` (a `reportlab` dependency) | `reportlab` requires `pillow`, which ships binary wheels. |
| **Disk space** | Input file size + output file size + transient memory | Output is approximately input size plus 1–3 KB per stamped page. |
| **Memory** | Approximately 2× input document size | `pypdf` loads the document object model into memory; see §11. |
| **Network access** | **Not required at runtime.** Required once at install time to download packages from PyPI. | The tool performs no network I/O. |
| **External binaries** | **None.** No `poppler`, no `qpdf`, no `pdftk`, no `tesseract`, no Ghostscript. | Confirmed: the source imports only `argparse`, `io`, `random`, `string`, `sys`, `datetime`, `pathlib`, `pypdf`, `reportlab`. |
| **Privileges** | Standard user. Read access to the input path, write access to the output directory. | No elevated privileges used or required. |

### 3.2 Source-Level Language Compatibility

The file `scripts/stamp_pdf.py` begins with `from __future__ import annotations`, which defers evaluation of all type annotations. The *syntax* of the module is therefore compatible with Python 3.7+. The effective minimum of **3.9** is imposed solely by the third-party dependencies, not by the source code.

### 3.3 Component B Additional Requirements

| Requirement | Specification |
|-------------|---------------|
| `pyyaml` | Required. Declared `>=6.0`. |
| `jsonschema` | Required. Declared `>=4.0`. **Not installed by default in every environment** — see §14.1. |

---

## 4. Dependency Specification

### 4.1 Complete `requirements.txt`

The file is reproduced here in full:

```
# Runtime dependencies for the PDF stamping tool (scripts/stamp_pdf.py).
# Both are permissively licensed and free — the tool has no paid/API cost.
pypdf>=4.0
reportlab>=4.0

# Dependencies for the existing Power Apps YAML validator (scripts/validate_yaml.py).
pyyaml>=6.0
jsonschema>=4.0
```

### 4.2 Dependency Details

| Package | Constraint | Verified version | Licence | Used by | Purpose in this solution |
|---------|-----------|------------------|---------|---------|--------------------------|
| `pypdf` | `>=4.0` | 6.14.2 | BSD-3-Clause | Component A | Reads the input PDF, exposes pages, merges the overlay, writes the output PDF. Provides `PdfReader`, `PdfWriter`, `page.merge_page`, `page.transfer_rotation_to_content`, `page.mediabox`. |
| `reportlab` | `>=4.0` | 5.0.0 | BSD-3-Clause | Component A | Generates the in-memory overlay PDF. Provides `canvas.Canvas`, `Color`, `setFont`, `setFillColor`, `stringWidth`, `drawString`. |
| `pillow` | transitive | 12.3.0 | MIT-CMU | Component A (indirect) | Required by `reportlab`. Not imported directly by this solution. |
| `pyyaml` | `>=6.0` | 6.0.1 | MIT | Component B | Parses YAML documents and the schema file via `yaml.safe_load`. |
| `jsonschema` | `>=4.0` | 4.26.0 | MIT | Component B | Performs schema validation via `jsonschema.validate`; raises `jsonschema.ValidationError`. |

**Cost statement:** every dependency above is free and permissively licensed (BSD-3-Clause, MIT, MIT-CMU). There are no commercial, subscription, metered, or attribution-encumbered components anywhere in the solution.

### 4.3 Transitive Dependency Note

`pypdf` optionally imports `cryptography` for encrypted-PDF support. It is not listed in `requirements.txt` because the solution does not process encrypted PDFs (§6.12, §12). If a broken or ABI-incompatible `cryptography` is present in the environment, `import pypdf` itself can fail; the remedy is in §14.2.

---

## 5. Installation Procedures

### 5.1 Standard Installation

```bash
git clone https://github.com/kanihamza/EAA-Cloud.git
cd EAA-Cloud
pip install -r requirements.txt
```

### 5.2 Isolated Installation (recommended for servers)

```bash
git clone https://github.com/kanihamza/EAA-Cloud.git
cd EAA-Cloud
python3 -m venv .venv
source .venv/bin/activate          # Linux / macOS
# .venv\Scripts\activate.bat       # Windows cmd.exe
# .venv\Scripts\Activate.ps1       # Windows PowerShell
pip install --upgrade pip
pip install -r requirements.txt
```

### 5.3 Component-A-Only Installation

If Component B is not required:

```bash
pip install "pypdf>=4.0" "reportlab>=4.0"
```

### 5.4 Offline / Air-Gapped Installation

On a networked machine of the same platform and Python version:

```bash
pip download -r requirements.txt -d ./wheelhouse
```

Transfer `./wheelhouse` to the target machine, then:

```bash
pip install --no-index --find-links ./wheelhouse -r requirements.txt
```

### 5.5 Installation Verification

```bash
python3 -c "import pypdf, reportlab; print('pypdf', pypdf.__version__); print('reportlab', reportlab.Version)"
python3 scripts/stamp_pdf.py --help
```

A successful installation prints the two version strings and then the complete help text reproduced in §6.14.

### 5.6 Execution Permission (optional)

The script carries the shebang `#!/usr/bin/env python3`. To invoke it directly:

```bash
chmod +x scripts/stamp_pdf.py
./scripts/stamp_pdf.py input.pdf
```

This is optional; `python3 scripts/stamp_pdf.py` works without it.

---

## 6. Component A — PDF Stamping Tool

### 6.1 Functional Specification

**Module:** `scripts/stamp_pdf.py`

**Function:** Given an input PDF and a text identifier, produce an output PDF identical to the input except that the identifier appears at a specified position on each selected page.

**Inputs:**
- One PDF file (required).
- Zero or more configuration parameters (all optional; complete list in §6.3).

**Outputs:**
- One PDF file written to disk.
- One success line on `stdout`, or one or more diagnostic lines on `stderr`.
- One process exit code (§6.11).

**Guarantees:**
1. The input file is never modified, unless the caller explicitly directs output to the input path (§6.13, row "in-place overwrite").
2. Every page of the input appears in the output, in the original order, whether or not it was selected for stamping.
3. Pages not selected via `--pages` are passed through unaltered.
4. The stamped identifier is extractable as text from the output.
5. The tool never transmits data over a network.

### 6.2 Processing Pipeline

The complete, ordered sequence of operations performed on every invocation:

| Step | Operation | Implementation | Failure behaviour |
|------|-----------|----------------|-------------------|
| 1 | Parse command line | `build_parser().parse_args(argv)` | Invalid syntax or type → argparse prints usage to `stderr`, exits **2**. |
| 2 | Verify input exists and is a regular file | `args.input.is_file()` | Not a file → message to `stderr`, returns **1**. |
| 3 | Validate opacity range | `0.0 <= args.opacity <= 1.0` | Out of range → message to `stderr`, returns **1**. |
| 4 | Resolve tracking ID | `args.tracking_id or generate_tracking_id(args.prefix)` | Cannot fail. |
| 5 | Resolve output path | `args.output or args.input.with_name(f"{stem}-stamped.pdf")` | Cannot fail. |
| 6 | Open input document | `PdfReader(str(input_path))` | Malformed/encrypted → caught, message to `stderr`, returns **1**. |
| 7 | Convert colour | `_hex_to_color(color_hex, opacity)` | Invalid hex → caught, message to `stderr`, returns **1**. |
| 8 | Determine page selection | `_parse_pages(pages, total)` if `pages` is truthy, else all pages | Invalid spec → caught, message to `stderr`, returns **1**. |
| 9 | For each page: if selected and `/Rotate` ≠ 0, bake rotation into content | `page.transfer_rotation_to_content()` | Propagates to the catch-all handler. |
| 10 | For each selected page: read visible dimensions | `page.mediabox` → `width`, `height` | Propagates. |
| 11 | For each selected page: build overlay | `_make_overlay(...)` | Unknown font → caught, message to `stderr`, returns **1**. |
| 12 | For each selected page: composite overlay | `page.merge_page(overlay, over=True)` | Propagates. |
| 13 | Append page to output document | `writer.add_page(page)` | Propagates. |
| 14 | Create output directory tree | `output_path.parent.mkdir(parents=True, exist_ok=True)` | Permission denied → caught, message to `stderr`, returns **1**. |
| 15 | Write output document | `writer.write(fh)` | I/O error → caught, message to `stderr`, returns **1**. |
| 16 | Report success | Prints `✅ Stamped '<id>' onto <path>` to `stdout` | Returns **0**. |

**Note on step 9–12 ordering:** a fresh overlay is constructed per page. This is deliberate: page dimensions may vary within a single document (mixed page sizes are common in scanned batches), and the overlay must match the dimensions of the page it is merged onto.

### 6.3 Complete CLI Parameter Reference

**Invocation form:**

```
python scripts/stamp_pdf.py input [-h] [-o OUTPUT] [--id TRACKING_ID] [--prefix PREFIX]
                                  [--position {top-left,top-right,bottom-left,bottom-right,center}]
                                  [--font-size FONT_SIZE] [--font-name FONT_NAME]
                                  [--color COLOR] [--opacity OPACITY] [--margin MARGIN]
                                  [--pages PAGES]
```

Every parameter accepted by the tool is specified below. There are eleven in total: one positional, one help flag, and nine options.

---

#### 6.3.1 `input` (positional)

| Property | Value |
|----------|-------|
| **Syntax** | `input` |
| **Required** | Yes |
| **Type** | `pathlib.Path` (argparse `type=Path`) |
| **Default** | None — omitting it is an error |
| **Valid values** | Any filesystem path to an existing, readable, unencrypted PDF file. Absolute or relative. Relative paths resolve against the current working directory. |
| **Accepts** | Scanned/image-only PDFs, digitally generated PDFs, hybrid PDFs, multi-page PDFs, PDFs with mixed page sizes, PDFs with `/Rotate` values of 0, 90, 180 or 270. |
| **Rejects** | Non-existent paths, directories, non-PDF files, encrypted PDFs. |
| **Validation** | `args.input.is_file()` — must exist *and* be a regular file. |
| **On omission** | argparse error: `the following arguments are required: input`, exit code **2**. |
| **On invalid** | `❌ Input file not found: <path>`, exit code **1**. |

---

#### 6.3.2 `-o` / `--output`

| Property | Value |
|----------|-------|
| **Syntax** | `-o OUTPUT` or `--output OUTPUT` |
| **Required** | No |
| **Type** | `pathlib.Path` |
| **Default** | `None` → computed as `<input-directory>/<input-stem>-stamped.pdf` (§6.8) |
| **Valid values** | Any writable filesystem path. Parent directories that do not exist are **created automatically**, recursively (`mkdir(parents=True, exist_ok=True)`). |
| **Overwrite behaviour** | An existing file at the target path is **overwritten without warning or prompt**. |
| **In-place operation** | Setting `--output` equal to `input` is supported and works correctly — `pypdf` fully materialises the document before the output stream is opened. Verified in §6.13. |
| **On failure** | Permission or I/O errors surface as `❌ Failed to stamp <input>: <reason>`, exit code **1**. |

---

#### 6.3.3 `--id`

| Property | Value |
|----------|-------|
| **Syntax** | `--id TRACKING_ID` |
| **Destination** | `args.tracking_id` |
| **Required** | No |
| **Type** | `str` |
| **Default** | `None` → an identifier is generated automatically (§6.7) |
| **Valid values** | Any string. There is no length limit, no character-set restriction and no format enforcement imposed by the tool. |
| **Character support** | ASCII is fully supported. Non-ASCII characters are supported to the extent that the selected font provides glyphs. Verified: `RÉF-2026-✓-Ω` renders and extracts correctly under the default `Helvetica-Bold`. |
| **Empty string** | `--id ""` is accepted; the resulting stamp is empty (zero-width) and the output is visually identical to the input. |
| **Overflow** | Strings wider than the page are **not** wrapped, shrunk or clipped by the tool. See §6.13 and §12.3. |
| **Interaction** | When `--id` is supplied, `--prefix` is ignored entirely. |

---

#### 6.3.4 `--prefix`

| Property | Value |
|----------|-------|
| **Syntax** | `--prefix PREFIX` |
| **Required** | No |
| **Type** | `str` |
| **Default** | `REF` |
| **Valid values** | Any string. |
| **Effect** | Used only as the first segment of an auto-generated identifier: `<PREFIX>-<YYYYMMDD>-<RANDOM6>`. |
| **Interaction** | **Ignored** when `--id` is supplied, because `args.tracking_id or generate_tracking_id(args.prefix)` short-circuits. |
| **Verified values** | `REF` → `REF-20260731-NER01B`; `TRK` → `TRK-20260731-NER01B`; `EAA` → `EAA-20260731-HFR21L`. |

---

#### 6.3.5 `--position`

| Property | Value |
|----------|-------|
| **Syntax** | `--position {top-left,top-right,bottom-left,bottom-right,center}` |
| **Required** | No |
| **Type** | `str`, constrained by argparse `choices` |
| **Default** | `bottom-right` |
| **Valid values** | Exactly five, enumerated completely below. Any other value is rejected by argparse with exit code **2**. |

**Complete enumeration of valid values:**

| Value | Placement | Anchor behaviour |
|-------|-----------|------------------|
| `top-left` | Upper-left corner | Left edge fixed at `margin`; text extends rightward. |
| `top-right` | Upper-right corner | Right edge fixed at `margin` from the right; text extends leftward. |
| `bottom-left` | Lower-left corner | Left edge fixed at `margin`; text extends rightward. |
| `bottom-right` | Lower-right corner | Right edge fixed at `margin` from the right; text extends leftward. **(default)** |
| `center` | Horizontally centred, vertically at the exact vertical midpoint of the page | Text is centred on the horizontal axis; the baseline sits at `height / 2`. |

Exact coordinate formulas for all five values are given in §6.4.

---

#### 6.3.6 `--font-size`

| Property | Value |
|----------|-------|
| **Syntax** | `--font-size FONT_SIZE` |
| **Required** | No |
| **Type** | `float` |
| **Default** | `10.0` |
| **Unit** | PostScript points (1 pt = 1/72 inch) |
| **Valid values** | Any value parseable as a float. |
| **Validated range** | **None.** The tool performs no range checking on this parameter. |
| **Behaviour at `0`** | Accepted, exit code 0. Produces a zero-height, zero-width, invisible stamp. |
| **Behaviour at negative values** | Accepted, exit code 0. Produces inverted/undefined rendering. Not recommended. |
| **Behaviour at very large values** | Accepted, exit code 0. Text will overflow the page (§12.3). Verified at `400`. |
| **Non-numeric input** | argparse type error, exit code **2**. |
| **Recommended range** | `6.0` to `24.0` for corner stamps; up to `72.0` for `center` watermark-style stamps on a full page. |
| **Secondary effect** | Affects vertical placement for `top-left` and `top-right`, where `y = height − margin − font_size` (§6.4). |

---

#### 6.3.7 `--font-name`

| Property | Value |
|----------|-------|
| **Syntax** | `--font-name FONT_NAME` |
| **Required** | No |
| **Type** | `str` |
| **Default** | `Helvetica-Bold` |
| **Valid values** | The **14 standard PDF base fonts** registered by `reportlab`, enumerated completely below. These require no font embedding and are guaranteed to be present in every conformant PDF reader. |
| **On invalid value** | `❌ Failed to stamp <input>: '<FontName>'` (the message body is the raw `KeyError` argument), exit code **1**. |

**Complete enumeration of all 14 valid values** (verified programmatically against `reportlab.pdfbase.pdfmetrics.standardFonts`; all 14 confirmed usable by `setFont` and `stringWidth`):

| # | Value | Family | Style |
|---|-------|--------|-------|
| 1 | `Courier` | Courier | Regular (monospace) |
| 2 | `Courier-Bold` | Courier | Bold |
| 3 | `Courier-BoldOblique` | Courier | Bold Oblique |
| 4 | `Courier-Oblique` | Courier | Oblique |
| 5 | `Helvetica` | Helvetica | Regular (sans-serif) |
| 6 | `Helvetica-Bold` | Helvetica | Bold **(default)** |
| 7 | `Helvetica-BoldOblique` | Helvetica | Bold Oblique |
| 8 | `Helvetica-Oblique` | Helvetica | Oblique |
| 9 | `Symbol` | Symbol | Symbolic glyph set |
| 10 | `Times-Bold` | Times | Bold |
| 11 | `Times-BoldItalic` | Times | Bold Italic |
| 12 | `Times-Italic` | Times | Italic |
| 13 | `Times-Roman` | Times | Regular (serif) |
| 14 | `ZapfDingbats` | ZapfDingbats | Dingbat glyph set |

**Notes:**
- `Symbol` and `ZapfDingbats` map alphanumeric input to symbolic glyphs and are unsuitable for readable tracking identifiers.
- `Courier*` fonts are monospaced, giving predictable stamp width — useful when identifiers are fixed-length and consistent alignment across documents is required.
- Custom/embedded TrueType fonts are **not** supported by the current implementation (§12.6).

---

#### 6.3.8 `--color`

| Property | Value |
|----------|-------|
| **Syntax** | `--color COLOR` |
| **Required** | No |
| **Type** | `str` |
| **Default** | `#B00020` (a dark red, RGB 176, 0, 32) |
| **Accepted format** | Six hexadecimal digits representing red, green and blue, with an **optional** leading `#`. Both `#B00020` and `B00020` are valid and equivalent — the implementation calls `.lstrip("#")`. |
| **Case sensitivity** | Case-insensitive. `#b00020` and `#B00020` are equivalent (`int(h, 16)` accepts both). |
| **Digit count** | Exactly 6 after stripping `#`. Three-digit shorthand (`#F00`) and eight-digit RGBA (`#B00020FF`) are **not** supported. |
| **Conversion** | Each channel pair is converted by `int(pair, 16) / 255.0`, producing a float in `[0.0, 1.0]`. |
| **Alpha** | Not taken from this parameter. Transparency is controlled exclusively by `--opacity` (§6.3.9). |
| **On wrong length** | `❌ Failed to stamp <input>: Invalid hex color: '<value>' (expected #rrggbb)`, exit code **1**. |
| **On non-hex digits** | `❌ Failed to stamp <input>: invalid literal for int() with base 16: '<pair>'`, exit code **1**. |

**Reference values:**

| Colour | Value | RGB |
|--------|-------|-----|
| Default dark red | `#B00020` | 176, 0, 32 |
| Pure red | `#FF0000` | 255, 0, 0 |
| Corporate blue | `#0057B8` | 0, 87, 184 |
| Black | `#000000` | 0, 0, 0 |
| White | `#FFFFFF` | 255, 255, 255 |
| Mid grey | `#808080` | 128, 128, 128 |
| Green | `#008000` | 0, 128, 0 |

---

#### 6.3.9 `--opacity`

| Property | Value |
|----------|-------|
| **Syntax** | `--opacity OPACITY` |
| **Required** | No |
| **Type** | `float` |
| **Default** | `0.85` |
| **Valid range** | `0.0` to `1.0` **inclusive at both ends** (`0.0 <= args.opacity <= 1.0`). |
| **Semantics** | `0.0` = fully transparent (invisible). `1.0` = fully opaque. Intermediate values blend the stamp with underlying content. |
| **Boundary verification** | `0.0` → accepted, exit 0. `1.0` → accepted, exit 0. |
| **Out of range** | `❌ --opacity must be between 0.0 and 1.0`, exit code **1**. Verified at `-0.1`. |
| **Non-numeric** | argparse type error, exit code **2**. Verified with `abc`. |
| **Validation point** | Checked in `main()` **before** any file is opened, so an invalid opacity never produces a partial output file. |
| **Implementation** | Passed as the `alpha` argument to `reportlab.lib.colors.Color`, which emits a PDF graphics state (`ExtGState`) with constant alpha for the fill operation. |
| **Recommended values** | `0.85` (default) for corner stamps — clearly legible without obscuring content. `0.25`–`0.40` for `center` watermark-style stamps over document body text. |

---

#### 6.3.10 `--margin`

| Property | Value |
|----------|-------|
| **Syntax** | `--margin MARGIN` |
| **Required** | No |
| **Type** | `float` |
| **Default** | `18.0` (equal to 0.25 inch, since 18/72 = 0.25) |
| **Unit** | PostScript points (1 pt = 1/72 inch) |
| **Valid values** | Any value parseable as a float. |
| **Validated range** | **None.** No range checking is performed. |
| **Effect by position** | Applies to `top-left`, `top-right`, `bottom-left` and `bottom-right`. **Has no effect** on `center`, whose formula does not reference `margin` (§6.4). |
| **Negative values** | Accepted; place the stamp outside the visible page area (it will not be visible in most readers). |
| **Large values** | Accepted; a margin exceeding the page dimension moves the stamp off-page. |

**Conversion reference:**

| Desired margin | `--margin` value |
|----------------|------------------|
| 0 (flush to edge) | `0` |
| 0.25 inch | `18` (default) |
| 0.5 inch | `36` |
| 1 inch | `72` |
| 5 mm | `14.1732` |
| 10 mm | `28.3465` |
| 1 cm | `28.3465` |

---

#### 6.3.11 `--pages`

| Property | Value |
|----------|-------|
| **Syntax** | `--pages PAGES` |
| **Required** | No |
| **Type** | `str` |
| **Default** | `None` → **all pages are stamped** |
| **Numbering** | 1-based and inclusive (page 1 is the first page). |
| **Grammar** | Complete grammar in §6.6. |
| **Unselected pages** | Copied to the output **unmodified**; they are never dropped. |
| **On no valid pages** | `❌ Failed to stamp <input>: No valid pages in spec '<spec>' for a <N>-page document`, exit code **1**. |
| **On malformed token** | `❌ Failed to stamp <input>: invalid literal for int() with base 10: '<token>'`, exit code **1**. |

---

#### 6.3.12 `-h` / `--help`

| Property | Value |
|----------|-------|
| **Syntax** | `-h` or `--help` |
| **Effect** | Prints the complete help text (§6.14) to `stdout` and exits immediately. |
| **Exit code** | **0** |
| **Formatter** | `argparse.ArgumentDefaultsHelpFormatter` — every option's default value is appended automatically to its help string. |

---

### 6.4 Coordinate System and Positioning Specification

#### 6.4.1 Coordinate System

The PDF coordinate system used throughout is:

- **Origin:** bottom-left corner of the page, at `(0, 0)`.
- **X axis:** increases rightward.
- **Y axis:** increases **upward** (opposite to screen/image conventions).
- **Unit:** PostScript point, where 1 pt = 1/72 inch exactly.
- **Text anchor:** `drawString(x, y, text)` places the **baseline** of the text at `y`, with the **left edge** of the first glyph at `x`. Descenders (in `g`, `j`, `p`, `q`, `y`) extend below `y`.

#### 6.4.2 Derived Quantities

| Symbol | Derivation | Meaning |
|--------|------------|---------|
| `width` | `float(page.mediabox.width)` | Visible page width after rotation normalisation (§6.9). |
| `height` | `float(page.mediabox.height)` | Visible page height after rotation normalisation. |
| `text_width` | `canvas.stringWidth(text, font_name, font_size)` | Exact rendered width of the identifier in points, computed from the font's glyph metrics. |
| `margin` | `--margin` | Inset from the page edge. |
| `font_size` | `--font-size` | Type size, also used as the top inset allowance. |

#### 6.4.3 Complete Positioning Formulas

All five positions, exactly as implemented:

| `--position` | X coordinate | Y coordinate |
|--------------|--------------|--------------|
| `top-left` | `margin` | `height − margin − font_size` |
| `top-right` | `width − margin − text_width` | `height − margin − font_size` |
| `bottom-left` | `margin` | `margin` |
| `bottom-right` | `width − margin − text_width` | `margin` |
| `center` | `(width − text_width) / 2` | `height / 2` |

**Design notes:**
- For the two `top-*` positions, `font_size` is subtracted so that the *ascender* of the text sits approximately `margin` below the top edge, rather than the baseline sitting at the edge (which would push the glyphs off-page).
- For the two `bottom-*` positions, the baseline is placed exactly at `margin`, so descenders may extend into the margin area. With the default identifier character set (uppercase letters, digits, hyphens) there are no descenders, so this is not observable.
- `center` intentionally ignores `margin`.

#### 6.4.4 Worked Reference Computation

Computed for: US Letter page (612.0 × 792.0 pt), `--margin 18`, `--font-size 10`, `--font-name Helvetica-Bold`, identifier `REF-20260731-A1B2C3`.

Measured `text_width` = **109.480 pt**.

| `--position` | Resulting X (pt) | Resulting Y (pt) |
|--------------|------------------|------------------|
| `top-left` | 18.000 | 764.000 |
| `top-right` | 484.520 | 764.000 |
| `bottom-left` | 18.000 | 18.000 |
| `bottom-right` | 484.520 | 18.000 |
| `center` | 251.260 | 396.000 |

#### 6.4.5 Standard Page Dimensions Reference

Exact dimensions in points, as defined by `reportlab.lib.pagesizes`:

| Page size | Width (pt) | Height (pt) |
|-----------|-----------|------------|
| LETTER | 612.0000 | 792.0000 |
| LEGAL | 612.0000 | 1008.0000 |
| A3 | 841.8898 | 1190.5512 |
| A4 | 595.2756 | 841.8898 |
| A5 | 419.5276 | 595.2756 |

The tool does not assume any page size — it reads the actual `mediabox` of each page individually, so documents with mixed page sizes are handled correctly.

---

### 6.5 Colour and Transparency Specification

#### 6.5.1 Conversion Algorithm

Implemented in `_hex_to_color(hex_str, alpha)`:

1. Strip any leading `#` characters: `h = hex_str.lstrip("#")`.
2. Assert `len(h) == 6`; otherwise raise `ValueError("Invalid hex color: ... (expected #rrggbb)")`.
3. Split into three 2-character pairs at offsets 0, 2, 4.
4. Convert each pair: `int(pair, 16) / 255.0` → float in `[0.0, 1.0]`.
5. Construct `reportlab.lib.colors.Color(r, g, b, alpha=alpha)`.

#### 6.5.2 Colour Model

- **Model:** RGB, device-dependent (PDF `DeviceRGB` colour space).
- **Channel depth on input:** 8 bits per channel (2 hex digits).
- **Channel representation internally:** IEEE-754 double in `[0.0, 1.0]`.
- **CMYK:** not supported by this parameter. Documents requiring CMYK stamps for print production are out of scope for the current implementation.

#### 6.5.3 Transparency Model

- Alpha is applied as a **constant alpha** fill (PDF `ca` value within an `ExtGState` resource) emitted by `reportlab` when a `Color` carries `alpha < 1`.
- Alpha is applied to the fill operation of the text only. There is no background rectangle, so the remainder of the overlay page is fully transparent and never obscures underlying content.
- Blend mode is the PDF default, `Normal`.

---

### 6.6 Page Selection Grammar

#### 6.6.1 Formal Grammar

```
spec        ::= item ( "," item )*
item        ::= ε | single | range
single      ::= INTEGER
range       ::= INTEGER "-" INTEGER
INTEGER     ::= [0-9]+
```

Surrounding whitespace on each item is stripped before parsing (`part.strip()`).

#### 6.6.2 Evaluation Semantics

Implemented in `_parse_pages(spec, total)`:

1. Split the specification on `,`.
2. For each resulting part, strip whitespace. If the part is empty, **skip it silently**.
3. If the part contains `-`, split on the **first** `-` into `start` and `end`; convert both with `int()`; iterate `range(start, end + 1)` inclusive.
4. Otherwise convert the part with `int()`.
5. Retain a page number only if `1 <= p <= total`; store it as the 0-based index `p - 1` in a `set`.
6. If the resulting set is empty, raise `ValueError`.

**Key properties, all verified:**

- **Inclusive ranges:** `5-8` selects pages 5, 6, 7 and 8.
- **Out-of-range values are silently clamped away,** not treated as errors — provided at least one valid page remains.
- **Duplicates are harmless:** the result is a `set`, so `1,1,1` selects page 1 once.
- **Order is irrelevant:** `3,1` and `1,3` are equivalent; pages are always processed in document order.
- **Reversed ranges yield nothing:** `8-5` produces an empty `range()`, so if it is the only item the call raises.
- **Negative numbers are a syntax error,** not a "from the end" selector: `-3` splits on the first `-` into `""` and `"3"`, and `int("")` raises.

#### 6.6.3 Complete Behaviour Table (verified against a 2-page document)

| `--pages` value | Result | Exit | Explanation |
|-----------------|--------|------|-------------|
| *(omitted)* | All pages stamped | 0 | `pages` is `None`, so `set(range(total))` is used. |
| `""` (empty string) | **All pages stamped** | 0 | An empty string is falsy, so `_parse_pages` is never called and the all-pages default applies. |
| `1` | Page 1 only | 0 | Single page. |
| `2` | Page 2 only | 0 | Verified: page 1 unstamped, page 2 stamped. |
| `1,2` | Both pages | 0 | Comma list. |
| ` 1 , 2 ` | Both pages | 0 | Whitespace stripped per item. |
| `1,,2` | Both pages | 0 | Empty token skipped silently. |
| `1-999` | Both pages | 0 | Range clamped to the document length. |
| `1,3,5-8` | Only pages that exist | 0 | Non-existent pages dropped; succeeds if ≥1 valid. |
| `0` | **Error** | 1 | `0` is below the 1-based minimum; no valid pages remain. |
| `99` | **Error** | 1 | Out of range; no valid pages remain. |
| `8-5` | **Error** | 1 | Reversed range is empty; no valid pages remain. |
| `-3` | **Error** | 1 | `int("")` fails → `invalid literal for int() with base 10: ''`. |
| `abc` | **Error** | 1 | `int("abc")` fails. |

---

### 6.7 Tracking ID Specification

Applies when `--id` is **not** supplied.

#### 6.7.1 Format

```
<PREFIX>-<YYYYMMDD>-<RANDOM6>
```

| Segment | Source | Specification |
|---------|--------|---------------|
| `PREFIX` | `--prefix` | Default `REF`. Any string. |
| `YYYYMMDD` | `datetime.now().strftime("%Y%m%d")` | Local system date, zero-padded, 8 digits. **Local time zone**, not UTC. |
| `RANDOM6` | `random.choices(string.ascii_uppercase + string.digits, k=6)` | 6 characters drawn with replacement. |
| Separator | Literal | ASCII hyphen-minus `-`. |

#### 6.7.2 Random Segment Properties

| Property | Value |
|----------|-------|
| **Character set** | `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789` |
| **Alphabet size** | 36 |
| **Length** | 6 |
| **Total combinations** | 36⁶ = **2,176,782,336** |
| **Sampling** | With replacement (characters may repeat) |
| **Entropy** | ≈ 31.02 bits (log₂ 36⁶) |
| **Generator** | `random.choices`, backed by the Mersenne Twister PRNG |

#### 6.7.3 Uniqueness and Security Properties

- **Not cryptographically secure.** `random` is a deterministic PRNG, not `secrets`. Identifiers are therefore **predictable** to an attacker who can observe or infer the generator state. They must **not** be used as security tokens, access keys, capability URLs, or anything that must be unguessable.
- **Not collision-proof.** Identifiers are unique only probabilistically, and only the 6-character random segment varies within a given prefix and date. Measured birthday-bound collision probabilities for identifiers sharing the same prefix and the same day:

  | Identifiers issued that day | P(at least one collision) |
  |---|---|
  | 1,000 | 0.023% |
  | 2,000 | 0.092% |
  | 5,000 | 0.573% |
  | 10,000 | 2.271% |
  | 54,933 | 50% |

- **Uniqueness is not enforced.** The tool maintains no registry and performs no collision check against previously issued identifiers.
- **Recommendation:** where guaranteed uniqueness or unpredictability is required, generate the identifier in the calling system (database sequence, UUID, or `secrets.token_hex`) and pass it explicitly via `--id`.

#### 6.7.4 Verified Samples

Generated on 2026-07-31:

```
REF-20260731-0Q6205
REF-20260731-QSRL4A
REF-20260731-3EOLOJ
TRK-20260731-NER01B      (--prefix TRK)
EAA-20260731-HFR21L      (--prefix EAA)
```

---

### 6.8 Output File Naming Specification

When `--output` is omitted, the output path is computed as:

```python
args.input.with_name(f"{args.input.stem}-stamped.pdf")
```

**Semantics:**
- The output is placed in the **same directory** as the input.
- `Path.stem` removes only the **final** suffix, not all suffixes.
- The literal string `-stamped.pdf` is appended.

**Complete naming behaviour table:**

| Input path | Default output path |
|------------|--------------------|
| `scan.pdf` | `scan-stamped.pdf` |
| `/docs/invoice.pdf` | `/docs/invoice-stamped.pdf` |
| `my.doc.v2.pdf` | `my.doc.v2-stamped.pdf` *(verified)* |
| `report` (no extension) | `report-stamped.pdf` |
| `scan-stamped.pdf` | `scan-stamped-stamped.pdf` |

**Note:** repeated invocation without `--output` produces progressively longer names, and each run adds another stamp (§6.13). Supply `--output` explicitly in automated pipelines.

---

### 6.9 Rotation Handling Specification

#### 6.9.1 Problem

Scanned PDFs frequently carry a `/Rotate` entry on the page dictionary. This instructs the viewer to rotate the page for display, while the page's content stream and `MediaBox` remain in the original, unrotated coordinate space. Naively stamping at `mediabox` coordinates places the identifier in the wrong visual location and at the wrong orientation.

#### 6.9.2 Solution

Before computing any coordinates, the implementation performs:

```python
if int(page.get("/Rotate", 0)) % 360:
    page.transfer_rotation_to_content()
```

This `pypdf` operation rewrites the page content stream with a transformation matrix that bakes the rotation in, updates the `MediaBox` to the rotated dimensions, and clears the `/Rotate` entry. After this call, `mediabox` dimensions correspond exactly to what the reader displays, so the standard positioning formulas (§6.4.3) place the stamp correctly and upright.

#### 6.9.3 Specification Details

| Property | Value |
|----------|-------|
| **Handled `/Rotate` values** | 0, 90, 180, 270, and any multiple of 90. Values are normalised with `% 360`. |
| **Trigger condition** | `int(page.get("/Rotate", 0)) % 360` is non-zero. A `/Rotate` of `0` or `360` is a no-op and is skipped. |
| **Missing `/Rotate`** | Treated as `0` via the `get` default. |
| **Scope** | Applied **only to pages selected for stamping**. Unselected pages retain their original `/Rotate` and are passed through untouched. |
| **Visual effect on output** | None. The page renders identically before and after; only its internal representation changes. |
| **Stamp orientation** | Upright relative to the displayed page, in the visually correct corner. |
| **Verification** | Confirmed by rendering a 2-page document whose page 2 carried `/Rotate 90`. The stamp appeared in the visual top-right of the rotated page, correctly oriented (§13.2). |

---

### 6.10 Python API Reference

The module may be imported and used programmatically. Complete reference for every function it defines.

#### 6.10.1 Module-Level Constant

```python
POSITIONS: tuple[str, ...] = ("top-left", "top-right", "bottom-left", "bottom-right", "center")
```

The authoritative enumeration of valid positions, used to constrain the `--position` argparse choices.

---

#### 6.10.2 `generate_tracking_id`

```python
def generate_tracking_id(prefix: str = "REF") -> str
```

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Generate an automatic tracking identifier. |
| **Parameters** | `prefix` (`str`, default `"REF"`) — first segment of the identifier. |
| **Returns** | `str` in the form `<prefix>-<YYYYMMDD>-<RANDOM6>`. |
| **Raises** | Nothing. |
| **Side effects** | Reads the system clock; advances the global `random` module state. |
| **Determinism** | Non-deterministic. Seed `random.seed()` beforehand for reproducible output in tests. |
| **Public** | Yes. |

---

#### 6.10.3 `_hex_to_color`

```python
def _hex_to_color(hex_str: str, alpha: float) -> Color
```

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Convert a hexadecimal colour string and an alpha value into a `reportlab` `Color`. |
| **Parameters** | `hex_str` (`str`) — `#rrggbb` or `rrggbb`, case-insensitive. `alpha` (`float`) — opacity in `[0.0, 1.0]`. |
| **Returns** | `reportlab.lib.colors.Color` with `r`, `g`, `b` in `[0.0, 1.0]` and the supplied `alpha`. |
| **Raises** | `ValueError` if the string does not contain exactly 6 characters after stripping `#`. `ValueError` from `int()` if any pair is not valid hexadecimal. |
| **Alpha validation** | **None** — this function does not range-check `alpha`; that is done in `main()`. |
| **Public** | No (leading underscore). |

---

#### 6.10.4 `_make_overlay`

```python
def _make_overlay(
    width: float,
    height: float,
    text: str,
    *,
    position: str,
    font_name: str,
    font_size: float,
    color: Color,
    margin: float,
) -> PdfReader
```

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Build a single-page, transparent PDF overlay containing only the stamp text, sized to match the target page. |
| **Parameters** | `width`, `height` (`float`) — target page dimensions in points. `text` (`str`) — the string to render. All remaining parameters are **keyword-only**: `position` (one of `POSITIONS`), `font_name` (`str`), `font_size` (`float`), `color` (`Color`), `margin` (`float`). |
| **Returns** | `pypdf.PdfReader` wrapping an in-memory `io.BytesIO` buffer containing a one-page PDF. Access the page via `.pages[0]`. |
| **Raises** | `KeyError` if `font_name` is not a registered font. `ValueError` if `position` is not one of the five valid values. |
| **Side effects** | None on disk — the overlay exists only in memory. |
| **Public** | No. |

---

#### 6.10.5 `stamp_pdf`

```python
def stamp_pdf(
    input_path: Path,
    output_path: Path,
    text: str,
    *,
    position: str = "bottom-right",
    font_name: str = "Helvetica-Bold",
    font_size: float = 10.0,
    color_hex: str = "#B00020",
    opacity: float = 0.85,
    margin: float = 18.0,
    pages: str | None = None,
) -> None
```

| Aspect | Specification |
|--------|---------------|
| **Purpose** | The primary programmatic entry point. Stamps `text` onto `input_path` and writes the result to `output_path`. |
| **Positional parameters** | `input_path` (`Path`) — source PDF. `output_path` (`Path`) — destination PDF. `text` (`str`) — the identifier to stamp. |
| **Keyword-only parameters** | `position`, `font_name`, `font_size`, `color_hex`, `opacity`, `margin`, `pages` — semantics and valid values exactly as documented in §6.3. |
| **Returns** | `None`. |
| **Raises** | `FileNotFoundError` (input missing); `pypdf` errors for malformed or encrypted input (e.g. `FileNotDecryptedError`, `PdfStreamError`); `ValueError` for invalid colour or page specification; `KeyError` for unknown font; `OSError` for filesystem failures. **This function does not catch exceptions** — the CLI wrapper does. |
| **Side effects** | Creates `output_path.parent` recursively if absent. Creates or overwrites `output_path`. |
| **Validation not performed** | Does **not** range-check `opacity`, `font_size` or `margin`. Callers using the API directly must validate these themselves if required. |
| **Public** | Yes. |

**Programmatic usage:**

```python
from pathlib import Path
import sys

sys.path.insert(0, "scripts")
from stamp_pdf import stamp_pdf, generate_tracking_id

tracking_id = generate_tracking_id("EAA")

stamp_pdf(
    Path("incoming/scan.pdf"),
    Path("processed/scan-stamped.pdf"),
    tracking_id,
    position="bottom-right",
    font_name="Helvetica-Bold",
    font_size=10.0,
    color_hex="#B00020",
    opacity=0.85,
    margin=18.0,
    pages=None,
)
```

---

#### 6.10.6 `_parse_pages`

```python
def _parse_pages(spec: str, total: int) -> set[int]
```

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Convert a 1-based page specification string into a set of 0-based page indices. |
| **Parameters** | `spec` (`str`) — specification per the grammar in §6.6.1. `total` (`int`) — number of pages in the document, used for clamping. |
| **Returns** | `set[int]` of 0-based indices, guaranteed non-empty. |
| **Raises** | `ValueError` if no valid page remains, or if any token is not a valid integer. |
| **Public** | No. |

---

#### 6.10.7 `build_parser`

```python
def build_parser() -> argparse.ArgumentParser
```

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Construct the fully configured argument parser. |
| **Parameters** | None. |
| **Returns** | `argparse.ArgumentParser` with all arguments from §6.3 registered and `ArgumentDefaultsHelpFormatter` applied. |
| **Raises** | Nothing. |
| **Public** | Yes — useful for embedding, testing, or generating documentation. |

---

#### 6.10.8 `main`

```python
def main(argv: list[str] | None = None) -> int
```

| Aspect | Specification |
|--------|---------------|
| **Purpose** | CLI entry point: parses arguments, validates, invokes `stamp_pdf`, reports the result. |
| **Parameters** | `argv` (`list[str] | None`, default `None`) — argument list. When `None`, argparse reads `sys.argv[1:]`. |
| **Returns** | `int` exit code: `0` on success, `1` on handled error. (argparse raises `SystemExit(2)` internally for syntax errors.) |
| **Raises** | `SystemExit(2)` propagated from argparse on invalid syntax or `--help` (`SystemExit(0)`). All other exceptions from `stamp_pdf` are caught and converted into exit code `1`. |
| **Side effects** | Writes to `stdout` on success, `stderr` on failure. Creates the output file. |
| **Public** | Yes. |

**Module execution guard:**

```python
if __name__ == "__main__":
    raise SystemExit(main())
```

---

### 6.11 Exit Codes

Complete enumeration. There are exactly three exit codes.

| Code | Meaning | Emitted by | Output stream | Trigger conditions |
|------|---------|------------|---------------|--------------------|
| **0** | Success | `main()` returns `0`; or `--help` | `stdout` | The output PDF was written successfully; or help text was displayed. |
| **1** | Handled runtime error | `main()` returns `1` | `stderr` | Input file missing or not a regular file; opacity outside `[0.0, 1.0]`; malformed PDF; encrypted PDF; invalid colour; invalid page specification; unknown font; filesystem/permission error. |
| **2** | Command-line syntax error | `argparse` raises `SystemExit(2)` | `stderr` | Required `input` omitted; unknown option supplied; invalid value for `--position` (not in `choices`); non-numeric value for `--font-size`, `--opacity` or `--margin`. |

**Shell integration:**

```bash
if python3 scripts/stamp_pdf.py "$INPUT" --id "$REF" -o "$OUTPUT"; then
    echo "Stamped successfully"
else
    code=$?
    case $code in
        1) echo "Runtime error — see stderr" ;;
        2) echo "Invalid command line" ;;
        *) echo "Unexpected exit code: $code" ;;
    esac
    exit $code
fi
```

---

### 6.12 Complete Error Catalogue

Every error the tool can emit, with its exact message text, cause, exit code and stream. All entries were reproduced and captured directly from execution.

| # | Exact message | Cause | Exit | Stream |
|---|---------------|-------|------|--------|
| 1 | `❌ Input file not found: <path>` | The `input` path does not exist, or exists but is not a regular file (e.g. a directory). | 1 | stderr |
| 2 | `❌ --opacity must be between 0.0 and 1.0` | `--opacity` parsed as a float outside the inclusive range `[0.0, 1.0]`. | 1 | stderr |
| 3 | `❌ Failed to stamp <input>: Invalid hex color: '<value>' (expected #rrggbb)` | `--color` did not contain exactly 6 characters after stripping `#`. | 1 | stderr |
| 4 | `❌ Failed to stamp <input>: invalid literal for int() with base 16: '<pair>'` | `--color` had the correct length but contained non-hexadecimal characters. | 1 | stderr |
| 5 | `❌ Failed to stamp <input>: No valid pages in spec '<spec>' for a <N>-page document` | `--pages` parsed successfully but selected no page within `1..N` (e.g. `0`, `99`, `8-5`). | 1 | stderr |
| 6 | `❌ Failed to stamp <input>: invalid literal for int() with base 10: '<token>'` | `--pages` contained a non-integer token (e.g. `abc`) or a leading-hyphen value (e.g. `-3`, which yields an empty first token). | 1 | stderr |
| 7 | `❌ Failed to stamp <input>: '<FontName>'` | `--font-name` is not one of the 14 registered standard fonts. The message body is the bare `KeyError` argument. | 1 | stderr |
| 8 | `❌ Failed to stamp <input>: File has not been decrypted` | The input PDF is encrypted (password-protected). Preceded by no other output. | 1 | stderr |
| 9 | `invalid pdf header: b'<bytes>'`<br>`EOF marker not found`<br>`❌ Failed to stamp <input>: Stream has ended unexpectedly` | The input file is not a PDF. The first two lines are warnings emitted by `pypdf`; the third is the tool's own message. All three go to stderr. | 1 | stderr |
| 10 | `usage: stamp_pdf.py [-h] …`<br>`stamp_pdf.py: error: the following arguments are required: input` | No arguments supplied. | 2 | stderr |
| 11 | `usage: stamp_pdf.py [-h] …`<br>`stamp_pdf.py: error: argument --opacity: invalid float value: '<value>'` | `--opacity`, `--font-size` or `--margin` given a non-numeric value (argument name varies accordingly). | 2 | stderr |
| 12 | `usage: stamp_pdf.py [-h] …`<br>`stamp_pdf.py: error: argument --position: invalid choice: '<value>' (choose from 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center')` | `--position` given a value outside the five valid choices. | 2 | stderr |

**Success message (for completeness):**

| Exact message | Condition | Exit | Stream |
|---------------|-----------|------|--------|
| `✅ Stamped '<tracking-id>' onto <output-path>` | The output PDF was written successfully. | 0 | stdout |

**Stream discipline:** on failure, `stdout` receives **nothing at all** — verified. This makes `stdout` safe to capture and parse in pipelines without contamination by error text.

---

### 6.13 Verified Behaviour Matrix

Every row below was executed and its outcome captured directly. This is observed behaviour, not intended behaviour.

| Scenario | Command fragment | Observed result | Exit |
|----------|------------------|-----------------|------|
| Scanned image-only PDF | *(default)* | Stamp applied; text extractable | 0 |
| Auto-generated identifier | *(no `--id`)* | `REF-20260731-8UNV5I` style identifier applied | 0 |
| Explicit identifier | `--id "REF-2026-00042"` | Exact string applied | 0 |
| Rotated page (`/Rotate 90`) | *(default)* | Stamp in visual top-right, correctly oriented | 0 |
| Mixed selection | `--pages "2"` | Page 1 unstamped, page 2 stamped | 0 |
| All five positions | `--position <each>` | Each renders at the documented coordinates | 0 |
| Non-default font | `--font-name Times-Roman` | Applied | 0 |
| Colour without `#` | `--color B00020` | Accepted, identical to `#B00020` | 0 |
| Opacity lower bound | `--opacity 0.0` | Accepted; stamp fully transparent | 0 |
| Opacity upper bound | `--opacity 1.0` | Accepted; stamp fully opaque | 0 |
| Zero font size | `--font-size 0` | Accepted; invisible stamp; **no validation error** | 0 |
| Negative font size | `--font-size -5` | Accepted; **no validation error** | 0 |
| Oversized font | `--font-size 400` | Accepted; text overflows page; **no validation error** | 0 |
| Nested output directory | `-o "a/b/c/deep.pdf"` | Directory tree created automatically | 0 |
| In-place overwrite | `-o` equal to `input` | Succeeded; 2 pages preserved; stamp `INPLACE-1` present | 0 |
| Re-stamping a stamped file | second run with new `--id` | **Both** stamps present: text extracts as `REF-2026-00042\nSECOND-STAMP` | 0 |
| Unicode identifier | `--id "RÉF-2026-✓-Ω"` | Rendered and extracted exactly | 0 |
| Multi-dot input filename | `my.doc.v2.pdf` | Output `my.doc.v2-stamped.pdf` | 0 |
| Over-long identifier | 120-character identifier | `text_width` = 800.4 pt vs page 612 pt → computed `x` = **−206.4**; text runs off the left edge. **Silently accepted.** | 0 |
| Encrypted PDF | password-protected input | `File has not been decrypted` | 1 |
| Non-PDF input | `README.md` | `Stream has ended unexpectedly` | 1 |
| Directory as input | path to a directory | `Input file not found` | 1 |

---

### 6.14 Complete `--help` Output

Reproduced verbatim from execution:

```
usage: stamp_pdf.py [-h] [-o OUTPUT] [--id TRACKING_ID] [--prefix PREFIX]
                    [--position {top-left,top-right,bottom-left,bottom-right,center}]
                    [--font-size FONT_SIZE] [--font-name FONT_NAME]
                    [--color COLOR] [--opacity OPACITY] [--margin MARGIN]
                    [--pages PAGES]
                    input

Stamp a scanned PDF with a reference / tracking ID.

positional arguments:
  input                 Path to the input PDF (scanned or digital).

options:
  -h, --help            show this help message and exit
  -o OUTPUT, --output OUTPUT
                        Output path. Defaults to <input>-stamped.pdf next to
                        the input. (default: None)
  --id TRACKING_ID      Reference/tracking ID to stamp. Auto-generated if
                        omitted. (default: None)
  --prefix PREFIX       Prefix used when auto-generating a tracking ID.
                        (default: REF)
  --position {top-left,top-right,bottom-left,bottom-right,center}
  --font-size FONT_SIZE
  --font-name FONT_NAME
  --color COLOR         Stamp color as #rrggbb. (default: #B00020)
  --opacity OPACITY     0.0 (clear) to 1.0 (solid). (default: 0.85)
  --margin MARGIN       Margin from the edge, in points. (default: 18.0)
  --pages PAGES         Which pages to stamp, 1-based, e.g. '1,3,5-8'.
                        Default: all pages. (default: None)
```

---

## 7. Component B — Power Apps YAML Validation

### 7.1 Complete Source

`scripts/validate_yaml.py`, reproduced in full:

```python
import sys
import yaml
import jsonschema
from pathlib import Path

def validate_yaml_file(yaml_path, schema):
    with open(yaml_path) as f:
        data = yaml.safe_load(f)
    jsonschema.validate(instance=data, schema=schema)
    print(f"✅ {yaml_path} passed schema validation.")

def main(schema_path):
    with open(schema_path) as f:
        schema = yaml.safe_load(f)

    errors = 0
    for file in Path('.').rglob('*.yaml'):
        try:
            validate_yaml_file(file, schema)
        except jsonschema.ValidationError as e:
            print(f"❌ Schema validation failed for {file}:\n{e.message}")
            errors += 1
    if errors:
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python validate_yaml.py <schema-file>")
        sys.exit(1)
    main(sys.argv[1])
```

### 7.2 CLI Specification

| Property | Value |
|----------|-------|
| **Invocation** | `python scripts/validate_yaml.py <schema-file>` |
| **Arguments** | Exactly one positional argument: the path to the schema file. Additional arguments beyond the first are ignored (`sys.argv[1]` only). |
| **Argument parser** | None — manual `sys.argv` inspection. |
| **Working directory** | Significant. Discovery is rooted at `Path('.')`, the process's current working directory. |

### 7.3 File Discovery Specification

| Property | Value |
|----------|-------|
| **Pattern** | `Path('.').rglob('*.yaml')` — recursive from the current directory. |
| **Included** | Every file ending in `.yaml`, at any depth, **including the schema file itself** (it is validated against itself). |
| **Excluded** | Files ending in `.yml`. **This is a real behavioural distinction:** `.github/workflows/validate.yml` is *not* discovered, because `rglob('*.yaml')` does not match `.yml`. Verified. |
| **Files matched in this repository** | `powerapps-schema.yaml` (exactly one). |
| **Hidden directories** | Traversed; `rglob` does not skip dot-directories. |

### 7.4 Exit Codes

| Code | Condition |
|------|-----------|
| **0** | All discovered YAML files validated successfully, **or** no YAML files were discovered. |
| **1** | At least one file raised `jsonschema.ValidationError`; **or** no schema argument was supplied. |

### 7.5 Output Messages

| Exact message | Condition | Stream |
|---------------|-----------|--------|
| `✅ <path> passed schema validation.` | A file validated successfully. | stdout |
| `❌ Schema validation failed for <path>:\n<message>` | A file failed validation. | stdout |
| `Usage: python validate_yaml.py <schema-file>` | Fewer than 2 elements in `sys.argv`. | stdout |

**Note:** unlike Component A, Component B writes **all** messages, including errors, to `stdout`.

### 7.6 Complete Schema File

`powerapps-schema.yaml`, reproduced in full:

```yaml
Screens:
  - Name: Home
    Controls:
      - Type: Button
        Name: Submit
  - Name: Settings
    Controls:
      - Type: TextInput
        Name: UserName
```

### 7.7 Schema File Analysis — Important Finding

This file is **structurally a Power Apps data document, not a JSON Schema.**

Verified analysis:

| Check | Result |
|-------|--------|
| Top-level keys | `['Screens']` |
| Recognised JSON Schema keywords present (`type`, `properties`, `required`, `items`, `$schema`, `additionalProperties`, `definitions`, `allOf`, `anyOf`, `oneOf`) | **NONE** |

Because `jsonschema` ignores unrecognised keywords, a schema containing no recognised keywords is equivalent to the empty schema `{}`, which **accepts every possible instance**. Verified by validating deliberately invalid instances against it:

| Instance | Validation result |
|----------|-------------------|
| `{'anything': 123}` | **ACCEPTED** |
| `[1, 2, 3]` | **ACCEPTED** |
| `'a string'` | **ACCEPTED** |
| `None` | **ACCEPTED** |
| `{'Screens': 'not-a-list'}` | **ACCEPTED** |

**Consequence:** Component B currently passes vacuously. Its CI job reports success regardless of the content of any `.yaml` file in the repository. Verified end-to-end:

```
$ python3 scripts/validate_yaml.py powerapps-schema.yaml
✅ powerapps-schema.yaml passed schema validation.
exit=0
```

**This is a pre-existing condition of the repository, not a result of the PDF stamping work.** It is documented here because this document specifies the entire solution. Remediation would require rewriting `powerapps-schema.yaml` as a genuine JSON Schema; that change is outside the scope of the current branch and has not been made.

---

## 8. CI/CD Configuration

### 8.1 Complete Workflow File

`.github/workflows/validate.yml`, reproduced in full:

```yaml
name: PowerApps YAML Validation

on:
  push:
    branches:
      - feature/powerapps-validation
      - main
  pull_request:
    branches:
      - main

jobs:
  validate-yaml:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.11

      - name: Install dependencies
        run: pip install pyyaml jsonschema

      - name: Validate YAML schema
        run: |
          echo "🧩 Validating against schema..."
          python scripts/validate_yaml.py powerapps-schema.yaml
```

### 8.2 Complete Key-by-Key Specification

| Key | Value | Specification |
|-----|-------|---------------|
| `name` | `PowerApps YAML Validation` | Display name in the GitHub Actions UI. |
| `on.push.branches` | `[feature/powerapps-validation, main]` | The workflow runs on pushes to **exactly these two branches**. |
| `on.pull_request.branches` | `[main]` | The workflow runs on pull requests **targeting `main`**. |
| `jobs.validate-yaml.runs-on` | `ubuntu-latest` | GitHub-hosted Ubuntu runner. |
| Step 1 `uses` | `actions/checkout@v3` | Clones the repository into the runner workspace. |
| Step 2 `uses` | `actions/setup-python@v4` | Provisions the Python toolchain. |
| Step 2 `with.python-version` | `3.11` | Pinned interpreter version. |
| Step 3 `run` | `pip install pyyaml jsonschema` | Installs Component B dependencies **directly, not via `requirements.txt`**. Consequently `pypdf` and `reportlab` are **not** installed in CI. |
| Step 4 `run` | `echo …` then `python scripts/validate_yaml.py powerapps-schema.yaml` | Executes the validator from the repository root. |

### 8.3 CI Coverage Statement

Two facts about the current CI configuration, both verified from the workflow file:

1. **The PDF stamping tool is not covered by CI.** No workflow step installs `pypdf` or `reportlab`, and no step invokes `scripts/stamp_pdf.py`.
2. **The branch `claude/pdf-stamp-scanned-t122bm` does not trigger this workflow on push,** because it is not among the two listed push branches. The workflow will run for a pull request from this branch only when that pull request targets `main`.

These are statements of the current configuration. No workflow changes were made on this branch. Adding a CI job for Component A would be a reasonable follow-up; it has not been performed because it was not in scope.

---

## 9. Operational Procedures

### 9.1 Stamp a Single Document with an Externally Assigned Reference

```bash
python3 scripts/stamp_pdf.py "incoming/contract-4471.pdf" \
    --id "EAA-2026-004471" \
    --position bottom-right \
    --output "processed/contract-4471.pdf"
```

### 9.2 Batch-Stamp a Directory, One Unique Identifier per Document

```bash
#!/usr/bin/env bash
set -euo pipefail

IN_DIR="incoming"
OUT_DIR="processed"
LOG="stamping-register.csv"

mkdir -p "$OUT_DIR"
[ -f "$LOG" ] || echo "timestamp,source_file,output_file,tracking_id,exit_code" > "$LOG"

shopt -s nullglob
for pdf in "$IN_DIR"/*.pdf; do
    base="$(basename "$pdf")"
    out="$OUT_DIR/$base"

    if output="$(python3 scripts/stamp_pdf.py "$pdf" --output "$out" --prefix EAA 2>&1)"; then
        code=0
        # Success line format: ✅ Stamped '<id>' onto <path>
        id="$(printf '%s' "$output" | sed -n "s/.*Stamped '\([^']*\)'.*/\1/p")"
    else
        code=$?
        id=""
        printf 'FAILED (%s): %s\n%s\n' "$code" "$pdf" "$output" >&2
    fi

    printf '%s,%s,%s,%s,%s\n' \
        "$(date -Is)" "$pdf" "$out" "$id" "$code" >> "$LOG"
done
```

This procedure produces an auditable register mapping every source document to its assigned tracking identifier.

### 9.3 Batch-Stamp Programmatically with Database-Assigned References

```python
from pathlib import Path
import sys

sys.path.insert(0, "scripts")
from stamp_pdf import stamp_pdf

def process(records, in_dir: Path, out_dir: Path) -> list[dict]:
    """records: iterable of {"filename": str, "reference": str}"""
    results = []
    for record in records:
        source = in_dir / record["filename"]
        target = out_dir / record["filename"]
        try:
            stamp_pdf(
                source,
                target,
                record["reference"],
                position="bottom-right",
                font_name="Helvetica-Bold",
                font_size=10.0,
                color_hex="#B00020",
                opacity=0.85,
                margin=18.0,
                pages=None,
            )
            results.append({"file": str(source), "reference": record["reference"], "status": "ok"})
        except Exception as exc:
            results.append({"file": str(source), "reference": record["reference"],
                            "status": "failed", "error": str(exc)})
    return results
```

### 9.4 Apply a Centred Watermark-Style Reference

```bash
python3 scripts/stamp_pdf.py "scan.pdf" \
    --id "CONFIDENTIAL — EAA-2026-004471" \
    --position center \
    --font-size 28 \
    --opacity 0.25 \
    --color "#808080" \
    --output "watermarked.pdf"
```

### 9.5 Stamp Only the First Page (Cover-Page Reference)

```bash
python3 scripts/stamp_pdf.py "scan.pdf" --pages "1" --id "EAA-2026-004471"
```

### 9.6 Audit — Recover the Tracking Identifier from a Stamped Document

```python
from pypdf import PdfReader

reader = PdfReader("processed/contract-4471.pdf")
for index, page in enumerate(reader.pages, start=1):
    text = (page.extract_text() or "").strip()
    print(f"page {index}: {text!r}")
```

For a document stamped from an image-only scan, the extracted text consists solely of the stamped identifier, because the underlying scan contributes no text layer.

### 9.7 Verify a Stamp Is Present Before Releasing a Document

```bash
python3 - "$OUTPUT" "$EXPECTED_ID" <<'PY'
import sys
from pypdf import PdfReader

path, expected = sys.argv[1], sys.argv[2]
reader = PdfReader(path)
missing = [
    i for i, p in enumerate(reader.pages, start=1)
    if expected not in (p.extract_text() or "")
]
if missing:
    print(f"FAIL: '{expected}' missing on pages {missing}")
    raise SystemExit(1)
print(f"PASS: '{expected}' present on all {len(reader.pages)} pages")
PY
```

---

## 10. Security Specification

### 10.1 Data Handling

| Property | Specification |
|----------|---------------|
| **Network transmission** | None. The tool performs no network I/O whatsoever. Document contents never leave the host. |
| **Telemetry** | None. |
| **Temporary files on disk** | None. The overlay is constructed in an `io.BytesIO` buffer held in memory only. |
| **Persistent state** | None. No database, cache, registry or log file is created by the tool. |
| **Credentials** | None required, stored or read. |
| **Environment variables** | None read by the tool. |
| **Subprocess execution** | None. The tool never invokes a shell or external binary. |

### 10.2 Input Trust Model

| Consideration | Specification |
|---------------|---------------|
| **Input parsing** | Performed by `pypdf`. Malformed PDFs are a `pypdf` attack surface; keep the dependency current. |
| **Untrusted input** | Processing untrusted PDFs is as safe as `pypdf` is. The tool adds no `eval`, no deserialisation of untrusted Python, and no dynamic import. |
| **Path handling** | `--input` and `--output` are used as supplied. The tool performs **no** sandboxing or path-traversal restriction. A caller passing attacker-controlled paths can therefore read any file the process can read and write any file it can write. **Callers exposing this tool to untrusted input must validate and constrain paths themselves.** |
| **Directory creation** | `--output` creates parent directories recursively without restriction. |
| **Overwrite** | Existing output files are overwritten silently with no confirmation. |

### 10.3 Cryptographic Properties

| Property | Specification |
|----------|---------------|
| **Identifier generation** | Uses `random` (Mersenne Twister), **not** `secrets`. Auto-generated identifiers are **predictable** and must not be used as security tokens, access credentials or capability identifiers. See §6.7.3. |
| **Document signing** | Not performed. The stamp is not a digital signature and provides **no** cryptographic proof of origin, authenticity or integrity. |
| **Tamper resistance** | **None.** The stamp is ordinary PDF page content and can be removed or altered by anyone with a PDF editor. It is a tracking and administrative marking, not a security control. |
| **Encryption** | The tool neither encrypts nor decrypts. Encrypted inputs are rejected (§6.12, error 8). |
| **Redaction** | Not performed. The tool adds content; it never removes or obscures existing content. Overlaying text at low opacity does **not** redact anything beneath it. |

### 10.4 Compliance Considerations

- Because processing is entirely local, the tool introduces no cross-border data transfer and no third-party processor.
- The original document content is preserved unmodified, which supports evidential-integrity requirements — but note that the output is a *new file*; the input's own hash is unchanged only if `--output` differs from `--input`.
- If chain-of-custody requirements apply, record the input file hash, the assigned identifier and the output file hash at stamping time (§9.2 provides the register scaffold).

---

## 11. Performance Characteristics

### 11.1 Complexity

| Dimension | Complexity | Notes |
|-----------|-----------|-------|
| **Time vs. page count** | O(n) | One overlay is generated and merged per **selected** page. |
| **Time vs. page content size** | O(1) for the stamping operation | The tool does not parse, decode or re-encode existing page content. Cost is dominated by `pypdf`'s document read and write. |
| **Memory** | O(document size) | `pypdf` materialises the document object model in memory. Peak usage is approximately 2× the input file size. |
| **Overlay memory** | O(1) per page | Each overlay is a few kilobytes and is released after merging. |

### 11.2 Output Size Impact

Each stamped page gains: one content stream containing a text-drawing operator sequence, one font resource reference (no font data is embedded — standard base-14 fonts are referenced by name only), and, when `--opacity < 1.0`, one `ExtGState` resource.

Measured growth, stamping a 19-character identifier at `--font-size 10` onto a 2-page document:

| Configuration | Growth per stamped page |
|---------------|------------------------|
| `--opacity 0.85` (default; emits `ExtGState`) | **484 bytes** |
| `--opacity 1.0` (fully opaque; no `ExtGState`) | **436 bytes** |

Growth is essentially independent of the size of the underlying page content, because existing content is never re-encoded.

Because standard fonts are never embedded, output growth does not scale with the length of the identifier in any meaningful way, and no font licensing obligations arise.

### 11.3 Scaling Guidance

- Documents are processed independently; batch throughput scales linearly with parallel processes.
- For very large batches, prefer invoking `stamp_pdf()` from a single long-lived Python process (§9.3) over spawning one interpreter per document — interpreter startup and library import dominate per-document cost for small files.
- Selecting fewer pages via `--pages` reduces overlay generation work but does not reduce document read/write cost.

---

## 12. Limitations and Known Behaviours

Each limitation below was confirmed by execution. None is a defect in the sense of departing from the implementation; they are the current, documented boundaries of the tool.

### 12.1 Encrypted PDFs Are Not Supported
Password-protected inputs fail with `File has not been decrypted` (exit 1). **Workaround:** decrypt first with an authorised password, stamp, then re-encrypt.

### 12.2 No Numeric Range Validation on `--font-size` and `--margin`
Zero, negative and absurdly large values are accepted without error and produce invisible or off-page stamps. **Only `--opacity` is range-validated.** Callers must validate these themselves where correctness matters.

### 12.3 Long Identifiers Overflow the Page Silently
No wrapping, shrink-to-fit, truncation or width check is performed. A 120-character identifier at the default font and size measures 800.4 pt against a 612 pt page, producing a computed `x` of **−206.4** — the text runs off the left edge and is partially or wholly invisible. **Mitigation:** keep identifiers under approximately 30 characters at `--font-size 10` on Letter/A4, or reduce `--font-size` proportionally.

### 12.4 Stamping Is Cumulative, Not Idempotent
Re-running the tool on an already-stamped file adds a **second** stamp; it does not replace the first. Verified: text extracts as `REF-2026-00042\nSECOND-STAMP`. **Mitigation:** always stamp from the pristine source, or check for an existing stamp with the audit procedure in §9.6 before stamping.

### 12.5 No Rotation of the Stamp Itself
The identifier is always drawn horizontally. Diagonal or vertical watermark text is not supported.

### 12.6 Standard Fonts Only
Only the 14 base-14 PDF fonts are available. Custom or embedded TrueType/OpenType fonts are not supported, so glyph coverage is limited to those fonts' character sets. Non-ASCII text renders only where the chosen standard font provides the glyph.

### 12.7 Single Stamp per Page per Invocation
One identifier at one position per run. Multiple stamps require multiple sequential invocations, which is supported (§12.4) but cumulative.

### 12.8 No Background, Border or Box
The stamp is bare text. There is no opaque backing panel, so a stamp placed over dark or busy scanned content may have poor contrast. **Mitigation:** choose a corner position over white margin area, raise `--opacity`, or select a high-contrast `--color`.

### 12.9 Timestamp Uses Local Time Zone
Auto-generated identifiers embed `datetime.now()`, which is **local** time, not UTC. Machines in different time zones stamping near midnight can produce different date segments for the same logical moment. **Mitigation:** supply `--id` explicitly from a centralised, time-zone-normalised source.

### 12.10 No Progress Reporting
Long documents produce no incremental output. The single success line is printed only after the output file is fully written.

### 12.11 Auto-Generated Identifiers Are Neither Unique-Guaranteed nor Unpredictable
See §6.7.3 in full. No registry, no collision check, non-cryptographic PRNG.

### 12.12 Component B Validates Vacuously
`powerapps-schema.yaml` is not a JSON Schema and therefore accepts every instance. See §7.7 for the complete analysis and evidence. Pre-existing; not addressed on this branch.

### 12.13 Component B Does Not Discover `.yml` Files
`rglob('*.yaml')` does not match the `.yml` extension. Verified.

---

## 13. Verification and Test Procedures

### 13.1 Reproducible Test Fixture

The following script constructs a two-page, image-only ("scanned") PDF whose second page carries `/Rotate 90` — the fixture used to verify all behaviour in this document:

```python
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from PIL import Image, ImageDraw
from pypdf import PdfReader, PdfWriter

# 1. Build a raster image standing in for a scanned page.
img = Image.new("RGB", (1240, 1754), "white")
draw = ImageDraw.Draw(img)
draw.rectangle([40, 40, 1200, 300], outline="black", width=3)
draw.text((80, 120), "SCANNED CONTRACT DOCUMENT (image only, no text layer)", fill="black")
img.save("scan.png")

# 2. Place the image full-bleed on two pages — no text layer is produced.
c = canvas.Canvas("scan.pdf", pagesize=letter)
width, height = letter
for _ in range(2):
    c.drawImage("scan.png", 0, 0, width=width, height=height)
    c.showPage()
c.save()

# 3. Apply /Rotate 90 to page 2 to exercise rotation handling.
reader, writer = PdfReader("scan.pdf"), PdfWriter()
for index, page in enumerate(reader.pages):
    if index == 1:
        page.rotate(90)
    writer.add_page(page)
with open("scan.pdf", "wb") as fh:
    writer.write(fh)
```

### 13.2 Acceptance Test Procedure

| # | Test | Command | Expected result | Status |
|---|------|---------|-----------------|--------|
| 1 | Auto-identifier on scanned input | `python3 scripts/stamp_pdf.py scan.pdf -o out_auto.pdf` | Exit 0; success line naming a generated identifier | **PASS** |
| 2 | Explicit identifier, alternate position and colour | `python3 scripts/stamp_pdf.py scan.pdf --id "REF-2026-00042" --position top-right --font-size 14 --color "#0057B8" -o out_custom.pdf` | Exit 0 | **PASS** |
| 3 | Stamp is extractable text on **both** pages | `PdfReader("out_auto.pdf")` → `extract_text()` per page | Both pages return exactly the stamped identifier | **PASS** |
| 4 | Rotation correctness | Render `out_custom.pdf` page 2 to an image and inspect | Stamp in visual top-right, upright | **PASS** |
| 5 | Page selection | `python3 scripts/stamp_pdf.py scan.pdf --pages "2" --position center -o out_pages.pdf` | Page 1 unstamped, page 2 stamped | **PASS** |
| 6 | Opacity validation | `python3 scripts/stamp_pdf.py scan.pdf --opacity 2` | Exit 1, `❌ --opacity must be between 0.0 and 1.0` | **PASS** |
| 7 | Missing input | `python3 scripts/stamp_pdf.py nope.pdf` | Exit 1, `❌ Input file not found: nope.pdf` | **PASS** |

### 13.3 Visual Verification Procedure

Rendering requires one additional, optional package (`pypdfium2`, BSD-3-Clause / Apache-2.0) that is **not** a runtime dependency of the solution:

```bash
pip install pypdfium2
```

```python
import pypdfium2 as pdfium

pdf = pdfium.PdfDocument("out_custom.pdf")
for index in range(len(pdf)):
    pdf[index].render(scale=0.6).to_pil().save(f"render-{index + 1}.png")
```

Inspect the resulting PNGs to confirm stamp placement, colour, size and orientation.

### 13.4 Regression Check After Dependency Upgrades

After upgrading `pypdf` or `reportlab`, re-run §13.2 in full. The behaviours most sensitive to dependency changes are rotation handling (`transfer_rotation_to_content`), overlay compositing (`merge_page`), and constant-alpha emission.

---

## 14. Troubleshooting Guide

### 14.1 `ModuleNotFoundError: No module named 'jsonschema'`

**Cause:** Component B dependencies are not installed. `jsonschema` is not present in every environment by default.
**Resolution:** `pip install -r requirements.txt`, or `pip install jsonschema` for Component B alone. Component A does not require it.

### 14.2 `ModuleNotFoundError: No module named '_cffi_backend'` or `pyo3_runtime.PanicException` on `import pypdf`

**Cause:** A broken or ABI-incompatible system-packaged `cryptography` / `cffi`. `pypdf` imports `cryptography` for encrypted-PDF support at module load, so a broken installation prevents `pypdf` from importing at all. This was encountered and resolved during development on a Debian-based image where `cryptography` was installed by the system package manager without pip metadata.
**Resolution:**

```bash
pip install --ignore-installed --upgrade cffi cryptography
```

`--ignore-installed` is required because pip cannot uninstall a distribution installed by the OS package manager (`Cannot uninstall cryptography …, RECORD file not found`). Using a virtual environment (§5.2) avoids this class of conflict entirely.

### 14.3 `pip install` fails with `ReadTimeoutError`

**Cause:** Slow or throttled connection to PyPI.
**Resolution:** raise the timeout, e.g. `pip install --timeout 120 -r requirements.txt`. For repeated failures, use the offline procedure in §5.4.

### 14.4 The stamp is not visible in the output

Check, in order:

1. `--opacity` is not `0.0`.
2. `--font-size` is not `0` or negative (§12.2).
3. `--margin` is not larger than the page dimension, and not negative (which places the stamp off-page).
4. The identifier is not so long that it overflows off the page edge (§12.3).
5. `--color` is not `#FFFFFF` on a white background.
6. The intended page was actually selected by `--pages` (§6.6).

Confirm programmatically with the audit procedure in §9.6 — if `extract_text()` returns the identifier, the stamp is present in the file and the issue is one of visibility, not application.

### 14.5 The stamp appears in the wrong corner or sideways

**Cause:** almost always page rotation. The tool handles `/Rotate` (§6.9), but a page whose *content* was rotated at scan time without a corresponding `/Rotate` entry is, from the PDF's perspective, simply a page of that shape.
**Resolution:** verify with `int(page.get("/Rotate", 0))`. If it is `0` but the page appears rotated, normalise the document with an external tool before stamping, or select the position that corresponds to the desired visual corner.

### 14.6 `❌ Failed to stamp <input>: File has not been decrypted`

**Cause:** the input PDF is password-protected (§12.1).
**Resolution:** decrypt with an authorised password before stamping.

### 14.7 `❌ Failed to stamp <input>: '<FontName>'`

**Cause:** `--font-name` is not one of the 14 standard fonts.
**Resolution:** use a value from the complete enumeration in §6.3.7. Names are case-sensitive and hyphenated exactly as listed (e.g. `Helvetica-Bold`, not `helvetica bold`).

### 14.8 `❌ Failed to stamp <input>: No valid pages in spec '<spec>' for a <N>-page document`

**Cause:** the page specification selected nothing within `1..N` — commonly `0` (the numbering is 1-based), a page beyond the document length, or a reversed range such as `8-5`.
**Resolution:** consult the complete behaviour table in §6.6.3.

### 14.9 CI reports success but nothing is really being validated

**Cause:** §7.7 — `powerapps-schema.yaml` is not a JSON Schema and accepts every instance.
**Resolution:** rewrite it as a genuine JSON Schema. This is out of scope for the current branch and has not been changed.

---

## 15. Glossary

| Term | Definition |
|------|------------|
| **Base-14 fonts** | The 14 standard fonts every conformant PDF reader must provide without embedding: 4 Courier, 4 Helvetica, 4 Times, plus Symbol and ZapfDingbats. Enumerated in full in §6.3.7. |
| **Constant alpha (`ca`)** | The PDF graphics-state parameter controlling fill opacity, emitted here via an `ExtGState` resource when `--opacity < 1.0`. |
| **ExtGState** | Extended Graphics State — a PDF resource dictionary carrying parameters such as alpha that are not expressible as content-stream operators alone. |
| **Image-only PDF** | A PDF whose pages contain raster images and no text layer, typical of scanner output. Text extraction returns nothing. |
| **MediaBox** | The PDF page dictionary entry defining the page's physical dimensions in points. |
| **Overlay** | The single-page, transparent PDF generated in memory containing only the stamp, subsequently composited onto the target page. |
| **Point (pt)** | The PostScript unit of length used throughout PDF: exactly 1/72 inch. |
| **`/Rotate`** | A PDF page dictionary entry (0, 90, 180 or 270) instructing the viewer to rotate the page for display without altering its content coordinate space. |
| **Stamp** | The rendered tracking identifier composited onto a page by this tool. Not a digital signature and not tamper-resistant (§10.3). |
| **Tracking ID / Reference ID** | The string applied to the document, either supplied via `--id` or generated per §6.7. |

---

*End of document.*
