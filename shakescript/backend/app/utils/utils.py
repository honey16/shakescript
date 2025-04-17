import re
import json
from typing import Dict


def clean_json_text(text: str) -> str:
    """
    Preprocess raw text to make it more JSON-friendly before parsing.
    Removes code blocks, fixes single quotes, and handles trailing commas.
    """
    # Remove markdown code blocks (e.g., ```json ... ```)
    text = re.sub(r"```(?:json)?\s*\n(.*?)\n```", r"\1", text, flags=re.DOTALL)
    # Replace single quotes with double quotes for valid JSON
    text = text.replace("'", '"')
    # Remove trailing commas before closing brackets/braces
    text = re.sub(r",\s*}", "}", text)
    text = re.sub(r",\s*]", "]", text)
    # Strip leading/trailing whitespace
    text = text.strip()
    return text

def parse_episode_response(response_text: str, metadata: Dict) -> Dict:
    try:
        episode_data = json.loads(response_text)
        return episode_data
    except json.JSONDecodeError:
        json_pattern = r"```(?:json)?\s*\n(.*?)\n```"
        matches = re.findall(json_pattern, response_text, re.DOTALL)
        if matches:
            try:
                episode_data = json.loads(matches[0])
                return episode_data
            except:
                cleaned_text = matches[0].replace("'", '"')
                try:
                    episode_data = json.loads(cleaned_text)
                    return episode_data
                except:
                    pass
        json_pattern2 = r'{[\s\S]*"episode_title"[\s\S]*"episode_content"[\s\S]*}'
        match = re.search(json_pattern2, response_text)
        if match:
            try:
                cleaned_json = match.group(0).replace("'", '"')
                episode_data = json.loads(cleaned_json)
                return episode_data
            except:
                pass
        title_match = re.search(r'"episode_title":\s*"([^"]+)"', response_text)
        content_match = re.search(
            r'"episode_content":\s*"([^"]*(?:(?:"[^"]*)*[^"])*)"', response_text
        )
        episode_title = (
            title_match.group(1)
            if title_match
            else f"Episode {metadata.get('current_episode', 1)}"
        )
        episode_content = content_match.group(1) if content_match else response_text
        
        return {
            "episode_title": episode_title,
            "episode_content": episode_content,
        }

def parse_user_prompt(raw_prompt: str) -> str:
    """
    Cleans a user-submitted prompt by removing Markdown, excessive symbols, and normalizing formatting.
    """
    raw_prompt = raw_prompt.strip()

    # Remove Markdown headers (e.g., "### Title")
    raw_prompt = re.sub(r"#+\s*", "", raw_prompt)

    # Remove Markdown bold (**bold**) and italics (_italics_)
    raw_prompt = re.sub(r"\*\*(.*?)\*\*", r"\1", raw_prompt)  # Bold
    raw_prompt = re.sub(r"_(.*?)_", r"\1", raw_prompt)  # Italics

    # Replace Markdown bullet points (🔹, -, *, etc.) with simple line breaks
    raw_prompt = re.sub(r"🔹\s*", "- ", raw_prompt)
    raw_prompt = re.sub(r"[-*]\s*", "- ", raw_prompt)

    # Normalize multiple spaces and newlines
    raw_prompt = re.sub(r"\s*\n\s*", "\n", raw_prompt).strip()

    return raw_prompt
