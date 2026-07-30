#!/usr/bin/env python3
"""Stamp scanned PDF documents with a reference / tracking ID.

Zero-cost, self-contained: uses only the open-source ``pypdf`` and
``reportlab`` libraries. It works on *scanned* (image-based) PDFs because the
stamp is drawn as a transparent overlay and merged on top of every page, so it
never needs to read or understand the underlying page content.

Examples
--------
Auto-generate a tracking ID and stamp the bottom-right corner::

    python scripts/stamp_pdf.py scan.pdf

Provide your own reference and choose the position::

    python scripts/stamp_pdf.py scan.pdf --id "REF-2026-00042" --position top-right

Write to a specific output file with a larger, semi-transparent stamp::

    python scripts/stamp_pdf.py scan.pdf -o stamped.pdf --font-size 14 --opacity 0.6
"""

from __future__ import annotations

import argparse
import io
import random
import string
import sys
from datetime import datetime
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import Color
from reportlab.pdfgen import canvas

POSITIONS = ("top-left", "top-right", "bottom-left", "bottom-right", "center")


def generate_tracking_id(prefix: str = "REF") -> str:
    """Return a unique, human-readable tracking ID like ``REF-20260730-A1B2C3``."""
    date_part = datetime.now().strftime("%Y%m%d")
    rand_part = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{prefix}-{date_part}-{rand_part}"


def _hex_to_color(hex_str: str, alpha: float) -> Color:
    """Convert ``#rrggbb`` (or ``rrggbb``) to a reportlab Color with the given alpha."""
    h = hex_str.lstrip("#")
    if len(h) != 6:
        raise ValueError(f"Invalid hex color: {hex_str!r} (expected #rrggbb)")
    r, g, b = (int(h[i : i + 2], 16) / 255.0 for i in (0, 2, 4))
    return Color(r, g, b, alpha=alpha)


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
) -> PdfReader:
    """Build a single-page overlay (sized to the target page) containing the stamp."""
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=(width, height))
    c.setFont(font_name, font_size)
    c.setFillColor(color)

    text_width = c.stringWidth(text, font_name, font_size)

    if position == "top-left":
        x, y = margin, height - margin - font_size
    elif position == "top-right":
        x, y = width - margin - text_width, height - margin - font_size
    elif position == "bottom-left":
        x, y = margin, margin
    elif position == "bottom-right":
        x, y = width - margin - text_width, margin
    elif position == "center":
        x, y = (width - text_width) / 2, height / 2
    else:  # pragma: no cover - guarded by argparse choices
        raise ValueError(f"Unknown position: {position}")

    c.drawString(x, y, text)
    c.save()
    buffer.seek(0)
    return PdfReader(buffer)


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
) -> None:
    """Stamp ``text`` onto ``input_path`` and write the result to ``output_path``."""
    reader = PdfReader(str(input_path))
    writer = PdfWriter()
    color = _hex_to_color(color_hex, opacity)

    total = len(reader.pages)
    selected = _parse_pages(pages, total) if pages else set(range(total))

    for index, page in enumerate(reader.pages):
        if index in selected:
            # Scanned pages often carry a /Rotate flag: the viewer rotates the
            # page for display while the content coordinate system stays put.
            # Bake any rotation into the content first so the mediabox matches
            # what the reader sees, then stamp in those visible coordinates.
            if int(page.get("/Rotate", 0)) % 360:
                page.transfer_rotation_to_content()

            box = page.mediabox
            width, height = float(box.width), float(box.height)
            overlay = _make_overlay(
                width,
                height,
                text,
                position=position,
                font_name=font_name,
                font_size=font_size,
                color=color,
                margin=margin,
            ).pages[0]
            page.merge_page(overlay, over=True)
        writer.add_page(page)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "wb") as fh:
        writer.write(fh)


def _parse_pages(spec: str, total: int) -> set[int]:
    """Parse a 1-based page spec like ``1,3,5-8`` into a set of 0-based indices."""
    result: set[int] = set()
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            start_s, end_s = part.split("-", 1)
            start, end = int(start_s), int(end_s)
            for p in range(start, end + 1):
                if 1 <= p <= total:
                    result.add(p - 1)
        else:
            p = int(part)
            if 1 <= p <= total:
                result.add(p - 1)
    if not result:
        raise ValueError(f"No valid pages in spec {spec!r} for a {total}-page document")
    return result


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Stamp a scanned PDF with a reference / tracking ID.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("input", type=Path, help="Path to the input PDF (scanned or digital).")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Output path. Defaults to <input>-stamped.pdf next to the input.",
    )
    parser.add_argument(
        "--id",
        dest="tracking_id",
        default=None,
        help="Reference/tracking ID to stamp. Auto-generated if omitted.",
    )
    parser.add_argument(
        "--prefix",
        default="REF",
        help="Prefix used when auto-generating a tracking ID.",
    )
    parser.add_argument("--position", choices=POSITIONS, default="bottom-right")
    parser.add_argument("--font-size", type=float, default=10.0)
    parser.add_argument("--font-name", default="Helvetica-Bold")
    parser.add_argument("--color", default="#B00020", help="Stamp color as #rrggbb.")
    parser.add_argument("--opacity", type=float, default=0.85, help="0.0 (clear) to 1.0 (solid).")
    parser.add_argument("--margin", type=float, default=18.0, help="Margin from the edge, in points.")
    parser.add_argument(
        "--pages",
        default=None,
        help="Which pages to stamp, 1-based, e.g. '1,3,5-8'. Default: all pages.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)

    if not args.input.is_file():
        print(f"❌ Input file not found: {args.input}", file=sys.stderr)
        return 1

    if not 0.0 <= args.opacity <= 1.0:
        print("❌ --opacity must be between 0.0 and 1.0", file=sys.stderr)
        return 1

    tracking_id = args.tracking_id or generate_tracking_id(args.prefix)
    output = args.output or args.input.with_name(f"{args.input.stem}-stamped.pdf")

    try:
        stamp_pdf(
            args.input,
            output,
            tracking_id,
            position=args.position,
            font_name=args.font_name,
            font_size=args.font_size,
            color_hex=args.color,
            opacity=args.opacity,
            margin=args.margin,
            pages=args.pages,
        )
    except Exception as exc:  # noqa: BLE001 - surface a clean message to the CLI user
        print(f"❌ Failed to stamp {args.input}: {exc}", file=sys.stderr)
        return 1

    print(f"✅ Stamped '{tracking_id}' onto {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
