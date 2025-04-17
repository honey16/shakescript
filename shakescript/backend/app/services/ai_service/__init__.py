import google.generativeai as genai
from openai import OpenAI
from app.core.config import settings
from app.services.ai_service.instructions import AIInstructions
from app.services.ai_service.generation import AIGeneration
from app.services.ai_service.utils import AIUtils
from app.services.ai_service.validation import (
    validate_batch,
    regenerate_batch,
    is_consistent_with_previous,
    check_episode_quality,
    generate_episode_title,
)
from app.services.embedding_service import EmbeddingService
from typing import Dict, List, Any, Optional
import json


class AIService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash")
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.embedding_service = EmbeddingService()
        self.instructions = AIInstructions()
        self.generation = AIGeneration(self.model, self.embedding_service)
        self.utils = AIUtils()

    def call_llm(
        self, prompt: str, max_tokens: int = 1000, temperature: float = 0.7
    ) -> str:
        """
        Call the Gemini language model with the given prompt.
        """
        # Adjust temperature and max_tokens as needed for Gemini
        instruction = prompt
        first_response = self.model.generate_content(instruction)
        return first_response.text

    def extract_metadata(
        self, user_prompt: str, num_episodes: int, hinglish: bool = False
    ) -> Dict:
        return self.instructions.extract_metadata(
            user_prompt, num_episodes, hinglish, self.model
        )

    def generate_episode_helper(
        self,
        num_episodes: int,
        metadata: Dict,
        episode_number: int,
        char_text: str,
        story_id: int,
        prev_episodes: List = [],
        hinglish: bool = False,
        feedback: Optional[str] = None,
    ) -> Dict:
        return self.generation.generate_episode_helper(
            num_episodes,
            metadata,
            episode_number,
            char_text,
            story_id,
            prev_episodes,
            hinglish,
            feedback,
        )

    def validate_batch(
        self,
        story_id: int,
        current_episodes: List[Dict],
        prev_episodes: List[Dict],
        metadata: Dict,
    ) -> Dict[str, Any]:
        return validate_batch(self, story_id, current_episodes, prev_episodes, metadata)

    def regenerate_batch(
        self,
        story_id: int,
        current_episodes: List[Dict],
        prev_episodes: List[Dict],
        metadata: Dict,
        feedback: List[Dict],
    ) -> List[Dict]:
        return regenerate_batch(
            self, story_id, current_episodes, prev_episodes, metadata, feedback
        )

    def is_consistent_with_previous(
        self, current_episode: Dict, previous_episode: Dict
    ) -> bool:
        """
        Check if the current episode is consistent with the previous episode.
        """
        return is_consistent_with_previous(self, current_episode, previous_episode)

    def check_episode_quality(self, episode: Dict, metadata: Dict) -> Optional[str]:
        """
        Check the quality of an episode based on story metadata.
        """
        return check_episode_quality(self, episode, metadata)

    def generate_episode_title(self, episode_content: str) -> str:
        """
        Generate a title for an episode based on its content.
        """
        return generate_episode_title(self, episode_content)
