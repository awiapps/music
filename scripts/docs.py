#!/usr/bin/env python3
"""
TSDoc to mdBook Documentation Generator

Extracts TSDoc comments from TypeScript/TSX files and generates mdBook-compatible documentation.
Works with TypeScript monorepos and supports React component documentation.
"""

import os
import re
from typing import Dict, Any, List, Optional, Tuple
from pathlib import Path


def extract_tsdoc_blocks(file_content: str) -> List[str]:
    """Extract all TSDoc comment blocks from file content using regex."""
    # Pattern matches /** ... */ multiline blocks
    pattern = r"/\*\*[\s\S]*?\*/"
    blocks = []
    for match in re.finditer(pattern, file_content, re.DOTALL):
        blocks.append(match.group(0))
    return blocks


def _extract_type_from_braces(content: str) -> Tuple[Optional[str], str]:
    """Extract a type definition from curly braces, handling nested braces."""
    if not content.startswith("{"):
        return None, content
    brace_count = 0
    for i, char in enumerate(content):
        if char == "{":
            brace_count += 1
        elif char == "}":
            brace_count -= 1
            if brace_count == 0:
                extracted = content[1:i].strip()
                return extracted if extracted else None, content[i + 1 :].strip()
    return None, content


def _process_tag(tag: str, content: List[str], result: Dict[str, Any]) -> None:
    """Process a TSDoc tag and update the result dictionary."""
    content_str = " ".join([line.strip() for line in content if line.strip()]).strip()

    if tag in ("param", "argument", "arg"):
        param_type, remaining = _extract_type_from_braces(content_str)
        if param_type is None and content_str.startswith("{"):
            param_type, remaining = _extract_type_from_braces(content_str)

        param_match = re.match(
            r"(?:\[)?([a-zA-Z_$][\w$.]*?)(?:=([^]]+))?(?:\])?\s*(?:-\s*(.*))?$",
            remaining or content_str,
        )
        if param_match:
            param_name = param_match.group(1)
            default_value = param_match.group(2)
            param_desc = (param_match.group(3) or "").strip()
            is_optional = bool(
                re.match(
                    r"^\[([a-zA-Z_$][\w$.]*?)(?:=[^]]+)?\]", remaining or content_str
                )
            )

            param = {"name": param_name, "description": param_desc}
            if param_type:
                param["type"] = param_type
            if default_value:
                param["default"] = default_value
            if is_optional:
                param["optional"] = True

            if "params" not in result:
                result["params"] = []
            result["params"].append(param)

    elif tag == "returns":
        return_type, remaining = _extract_type_from_braces(content_str)
        return_desc = remaining.strip()
        result["returns"] = {"type": return_type or "", "description": return_desc}

    elif tag == "throws":
        if "throws" not in result:
            result["throws"] = []
        throw_type, remaining = _extract_type_from_braces(content_str)
        result["throws"].append(
            {"type": throw_type or "", "description": remaining.strip()}
        )

    else:
        # Generic tag handling (e.g., @example, @see, @remarks)
        if tag not in result["tags"]:
            result["tags"][tag] = []
        result["tags"][tag].append(content_str)


def parse_tsdoc(docstring: str) -> Dict[str, Any]:
    """Parse a TSDoc string into a structured dictionary."""
    result = {
        "description": "",
        "params": [],
        "returns": None,
        "throws": [],
        "examples": [],
        "tags": {},
    }

    # Clean up: remove /** */ and * prefixes
    docstring = docstring.strip()
    if docstring.startswith("/**"):
        docstring = docstring[3:]
    if docstring.endswith("*/"):
        docstring = docstring[:-2]
    lines = [re.sub(r"^[ \t]*\*", "", line).strip() for line in docstring.split("\n")]

    current_tag = None
    current_content = []

    for line in lines:
        tag_match = re.match(r"^@(\w+)\s*(.*)", line)
        if tag_match:
            if current_tag:
                _process_tag(current_tag, current_content, result)
            current_tag = tag_match.group(1)
            current_content = [tag_match.group(2)]
        elif current_tag:
            current_content.append(line)
        else:
            if line and result["description"]:
                result["description"] += "\n" + line
            elif line:
                result["description"] = line

    if current_tag:
        _process_tag(current_tag, current_content, result)

    # Split description into summary (first line) for MD heading
    if result["description"]:
        summary = result["description"].split("\n")[0].strip()
        result["summary"] = summary if summary else "Undocumented Item"
        result["full_description"] = result["description"]

    if result["returns"] and not isinstance(result["returns"], dict):
        result["returns"] = {"type": "", "description": result["returns"]}

    return result


def doc_to_markdown(
    doc: Dict[str, Any], source_file: str, item_name: str = None
) -> str:
    """Convert parsed TSDoc dict to Markdown section."""
    title = item_name if item_name else doc.get("summary", "Undocumented Item")
    md = f"### {title}\n\n"

    if doc.get("full_description"):
        md += f"{doc['full_description']}\n\n"

    if doc["params"]:
        md += "**Parameters:**\n\n"
        for param in doc["params"]:
            opt = " (optional)" if param.get("optional") else ""
            default = (
                f", default: `{param.get('default', '')}`"
                if param.get("default")
                else ""
            )
            param_type = (
                f"`{param.get('type', 'any')}`" if param.get("type") else "`any`"
            )
            md += f"- **{param['name']}**: {param_type}{opt}{default}  \n  {param['description']}\n\n"

    if doc["returns"]:
        ret = doc["returns"]
        ret_type = f"`{ret.get('type', 'void')}`" if ret.get("type") else "`void`"
        md += f"**Returns:** {ret_type}  \n{ret.get('description', '')}\n\n"

    if doc["throws"]:
        md += "**Throws:**\n\n"
        for throw in doc["throws"]:
            throw_type = (
                f"`{throw.get('type', 'Error')}`" if throw.get("type") else "`Error`"
            )
            md += f"- {throw_type}: {throw.get('description', '')}\n\n"

    if doc["tags"].get("example"):
        md += "**Example:**\n\n```typescript\n"
        md += "\n".join(doc["tags"]["example"]) + "\n```\n\n"

    if doc["tags"].get("remarks"):
        md += "**Remarks:**\n\n"
        md += "\n".join(doc["tags"]["remarks"]) + "\n\n"

    # Add source reference
    md += f"*Source: `{source_file}`*\n\n"
    md += "---\n\n"
    return md


def extract_export_names(file_content: str) -> List[str]:
    """Extract exported function/component names from TypeScript file."""
    exports = []

    # Match: export function Name, export const Name, export class Name
    patterns = [
        r"export\s+(?:async\s+)?function\s+([A-Z][a-zA-Z0-9]*)",
        r"export\s+const\s+([A-Z][a-zA-Z0-9]*)",
        r"export\s+class\s+([A-Z][a-zA-Z0-9]*)",
        r"export\s+interface\s+([A-Z][a-zA-Z0-9]*)",
        r"export\s+type\s+([A-Z][a-zA-Z0-9]*)",
    ]

    for pattern in patterns:
        matches = re.finditer(pattern, file_content)
        for match in matches:
            exports.append(match.group(1))

    return exports


def generate_mdbook_docs(
    codebase_path: str, output_path: str, exclude_patterns: List[str] = None
):
    """
    Main function: Walk codebase, parse TSDoc, generate MD for mdBook.

    Args:
        codebase_path: Root directory of the codebase
        output_path: Output directory for mdBook
        exclude_patterns: List of patterns to exclude (e.g., 'node_modules', 'dist')
    """
    if exclude_patterns is None:
        exclude_patterns = [
            "node_modules",
            "dist",
            "build",
            ".next",
            "out",
            "coverage",
            ".git",
        ]

    src_dir = Path(output_path) / "src"
    src_dir.mkdir(parents=True, exist_ok=True)

    # Organize docs by package
    packages_docs = {}
    files_with_docs = set()

    for root, dirs, files in os.walk(codebase_path):
        # Filter out excluded directories
        dirs[:] = [
            d for d in dirs if not any(pattern in d for pattern in exclude_patterns)
        ]

        for file in files:
            if not (file.endswith(".ts") or file.endswith(".tsx")):
                continue

            file_path = Path(root) / file
            rel_path = file_path.relative_to(codebase_path)

            # Determine package name from path
            parts = rel_path.parts
            if "packages" in parts:
                pkg_index = parts.index("packages")
                if len(parts) > pkg_index + 1:
                    package_name = parts[pkg_index + 1]
                else:
                    package_name = "root"
            else:
                package_name = "root"

            if package_name not in packages_docs:
                packages_docs[package_name] = ""

            try:
                content = file_path.read_text(encoding="utf-8")
            except Exception as e:
                print(f"Warning: Could not read {rel_path}: {e}")
                continue

            blocks = extract_tsdoc_blocks(content)
            export_names = extract_export_names(content)

            file_has_docs = False
            for i, block in enumerate(blocks):
                parsed = parse_tsdoc(block)
                if parsed["description"].strip():
                    # Try to match export name
                    item_name = export_names[i] if i < len(export_names) else None
                    packages_docs[package_name] += doc_to_markdown(
                        parsed, str(rel_path), item_name
                    )
                    file_has_docs = True

            if file_has_docs:
                files_with_docs.add(str(rel_path))

    # Write package-specific API docs
    summary_entries = ["# Summary\n\n- [Introduction](./introduction.md)\n"]

    for package_name, docs_content in sorted(packages_docs.items()):
        if docs_content.strip():
            filename = f"api-{package_name}.md"
            (src_dir / filename).write_text(
                f"# {package_name.title()} API\n\n{docs_content}"
            )
            summary_entries.append(f"- [{package_name.title()} API](./{filename})\n")

    # Generate introduction.md
    intro_content = f"""# AWMusic Documentation

Privacy-focused cross-platform music application.

## Architecture

This is a monorepo containing:

- **mobile**: React Native + Expo mobile app
- **desktop**: Tauri desktop application
- **website**: Astro website
- **api**: Backend API
- **shared**: Shared utilities and types

## Documentation

Generated from TSDoc comments in the source code.

Files with documentation: {len(files_with_docs)}
"""
    (src_dir / "introduction.md").write_text(intro_content)

    # Generate SUMMARY.md
    (Path(output_path) / "SUMMARY.md").write_text("".join(summary_entries))

    # Generate book.toml if it doesn't exist
    book_toml_path = Path(output_path) / "book.toml"
    if not book_toml_path.exists():
        book_toml = """[book]
title = "AWMusic Documentation"
authors = ["awfixer"]
language = "en"
multilingual = false
src = "src"

[output.html]
default-theme = "ayu"
preferred-dark-theme = "ayu"
git-repository-url = "https://github.com/awiapps/music"
"""
        book_toml_path.write_text(book_toml)

    print(f"✅ Generated mdBook docs in {output_path}")
    print(f"📦 Packages documented: {', '.join(sorted(packages_docs.keys()))}")
    print(f"📄 Files with docs: {len(files_with_docs)}")
    print(f"\nTo build: cd {output_path} && mdbook build")
    print(f"To serve: cd {output_path} && mdbook serve")


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python docs.py <output_dir> [codebase_dir]")
        print("\nExample: python docs.py ./docs")
        print("         python docs.py ./docs ../packages/mobile")
        sys.exit(1)

    output_dir = sys.argv[1]
    codebase_dir = (
        sys.argv[2]
        if len(sys.argv) > 2
        else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    )

    generate_mdbook_docs(codebase_dir, output_dir)
