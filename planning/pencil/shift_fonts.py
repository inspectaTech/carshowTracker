import json

with open('dashboard.pen', encoding='utf-8') as f:
    d = json.load(f)

size_map = {12: 14, 14: 16, 16: 20, 20: 28, 28: 32}

def shift_fonts(node):
    if isinstance(node, dict):
        if 'fontSize' in node and node['fontSize'] in size_map:
            node['fontSize'] = size_map[node['fontSize']]
        if 'children' in node:
            for c in node['children']:
                shift_fonts(c)
    elif isinstance(node, list):
        for item in node:
            shift_fonts(item)

shift_fonts(d)

with open('dashboard.pen', 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
print("Font sizes shifted: 12->14, 14->16, 16->20, 20->28, 28->32")
