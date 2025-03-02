import re
import json

def clean_text(text):
    # Replace newlines with spaces
    text = text.replace('\n', ' ')
    # Replace multiple spaces with a single space
    text = re.sub(r'\s+', ' ', text)
    return text.strip()
def clean_text_k(text, k):
    # fix this later to not use "~~~NEWLINE~~~"
    # Step 1: Collapse groups of 2 or more newlines into a protected marker.
    # This regex finds a left group of horizontal whitespace, followed by at least two newlines (with optional horizontal whitespace in between),
    # and then a right group of horizontal whitespace.
    def collapse_multi_newlines(match):
        left_ws = match.group(1)
        right_ws = match.group(2)
        # Replace the entire group with the left whitespace, a marker, then the right whitespace.
        return f"{left_ws}~~~NEWLINE~~~{right_ws}"
    
    text = re.sub(r'([ \t]*)\n(?:[ \t]*\n)+([ \t]*)', collapse_multi_newlines, text)
    
    # Step 2: Process single newline occurrences.
    # For a single newline, if both the whitespace before and after are longer than k, keep the newline;
    # otherwise, remove it (replace with a single space).
    def process_single_newline(match):
        left_ws = match.group(1)
        right_ws = match.group(2)
        if len(left_ws) > k and len(right_ws) > k:
            return left_ws + "\n" + right_ws
        else:
            return " "
    
    text = re.sub(r'([ \t]*)\n([ \t]*)', process_single_newline, text)
    
    # Step 3: Replace the protected marker with an actual newline.
    text = text.replace("~~~NEWLINE~~~", "\n")
    
    # Step 4: Finally, collapse extra horizontal whitespace (leaving newlines intact) and trim.
    text = re.sub(r'[ \t]+', ' ', text).strip()
    return text
def parse_structure(node, parent_title=None):
    """
    Recursively parse the given node (and its children),
    returning a list of [text, parent_title, title] entries.
    """
    # Prepare the return list
    result = []
    
    # Extract current node info
    current_text = node.get('text', '')
    current_title = node.get('title', '')

    # If there is no parent (i.e. top-level), use an empty string for parent_title
    # or you could keep it as None if desired, depending on how you want to handle top-level.
    effective_parent_title = parent_title if parent_title else ''

    # Append current node’s data
    result.append([current_text, effective_parent_title, current_title])
    
    # If there are children, recurse into each child
    children = node.get('children', [])
    for child in children:
        # Pass the current node’s title as the parent title
        result.extend(parse_structure(child, parent_title=current_title))
        
    return result
def get_property(prop: str, struct: list, max_properties: int = 2):
    properties = []
    for row in struct:
        if prop.lower() in row[2].lower():
            properties.append([row[0], row[2]])
        elif prop.lower() in row[1].lower():
            properties.append([row[0], row[1]])
        if len(properties) >= max_properties:
            break
    return properties
def split_strip_join(text):
    # Split the text into lines, strip each one, and filter out empty lines.
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return "\n".join(lines)