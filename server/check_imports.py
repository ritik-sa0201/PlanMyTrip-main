import sys
import os
import ast
import re

# Get standard library module names
stdlib_modules = set(sys.stdlib_module_names)

# Add our own top-level package
local_packages = {'app'}

# Function to extract imports from a Python file
def extract_imports(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    try:
        tree = ast.parse(content)
    except SyntaxError:
        # Skip files with syntax errors
        return set()
    imports = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                # Get the top-level module name
                top_level = alias.name.split('.')[0]
                imports.add(top_level)
        elif isinstance(node, ast.ImportFrom):
            if node.level == 0 and node.module:
                # Absolute import
                top_level = node.module.split('.')[0]
                imports.add(top_level)
            # Relative imports (node.level > 0) are from our own package, ignore
    return imports

# Walk through the directory
root_dir = '.'
all_imports = set()
for root, dirs, files in os.walk(root_dir):
    # Skip directories that are not part of the source (like __pycache__, .git, etc.)
    # But we want to include our own source
    # We'll skip hidden directories and __pycache__
    dirs[:] = [d for d in dirs if not d.startswith('.') and d != '__pycache__']
    for file in files:
        if file.endswith('.py'):
            filepath = os.path.join(root, file)
            imports = extract_imports(filepath)
            all_imports.update(imports)

# Remove standard library and local packages
external_imports = all_imports - stdlib_modules - local_packages

print("All imports found:", sorted(all_imports))
print("\nExternal imports (excluding stdlib and local):", sorted(external_imports))

# Now, read requirements.txt
req_file = 'requirements.txt'
if os.path.exists(req_file):
    with open(req_file, 'r') as f:
        lines = f.readlines()
    required_packages = set()
    for line in lines:
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        # Remove version specifiers
        # Use regex to split on comparison operators
        # Simple approach: split on ==, <=, >=, <, >, ~=, !=
        # We'll take the first part before any of these
        # Also handle extras: package[extra]==version
        # We'll split on '[' as well to get the base package
        # Actually, we just want the package name without version and extras.
        # Let's use a simple regex: ^([A-Za-z0-9][A-Za-z0-9._-]*)
        match = re.match(r'^([A-Za-z0-9][A-Za-z0-9._-]*)', line)
        if match:
            pkg = match.group(1).lower()
            required_packages.add(pkg)
    print("\nPackages in requirements.txt (normalized):", sorted(required_packages))
else:
    print(f"\n{req_file} not found.")
    required_packages = set()

# Check which external imports are not in requirements
missing = external_imports - required_packages
print("\nMissing in requirements.txt:", sorted(missing))

# Also check for possible aliases: we can check if the import is a substring of any required package?
# But let's just output the missing ones for manual review.