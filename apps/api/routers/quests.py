"""Quest submission and grading endpoint.

Implements POST /api/v1/quests/{id}/submit per API_SPECIFICATION.md Section 3.
"""

import os
from pathlib import Path

import yaml
from fastapi import APIRouter, Header, HTTPException, Request
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address

from grading.runner import grade_submission

router = APIRouter(prefix="/api/v1/quests", tags=["quests"])

CONTENT_DIR = Path(__file__).resolve().parent.parent.parent.parent / "content"


def _get_api_key() -> str:
    return os.getenv("INTERNAL_API_KEY", "")

limiter = Limiter(key_func=get_remote_address)


class SubmitRequest(BaseModel):
    quest_id: str
    code: str = Field(..., max_length=10240)
    language_version: str = "3.11"


class SubmitSuccess(BaseModel):
    status: str = "success"
    xp_earned: int
    level_up: bool = False
    new_level: int | None = None
    unlocked_badges: list[str] = []
    feedback: str = "Quest Complete!"


class SubmitFailure(BaseModel):
    status: str = "fail"
    error_type: str
    hint: str
    traceback: str = ""


def _find_quest_files(quest_id: str) -> tuple[Path | None, Path | None]:
    """Locate the quest .md and corresponding test .py by frontmatter id."""
    if not CONTENT_DIR.exists():
        return None, None

    for level_dir in sorted(CONTENT_DIR.iterdir()):
        if not level_dir.is_dir() or not level_dir.name.startswith("level_"):
            continue
        for quest_file in sorted(level_dir.glob("quest_*.md")):
            with open(quest_file, "r", encoding="utf-8") as f:
                content = f.read()

            if content.startswith("---"):
                end = content.index("---", 3)
                frontmatter = yaml.safe_load(content[3:end])
                if frontmatter and frontmatter.get("id") == quest_id:
                    test_name = quest_file.name.replace("quest_", "test_").replace(
                        ".md", ".py"
                    )
                    test_file = level_dir / test_name
                    return quest_file, test_file if test_file.exists() else None

    return None, None


def _get_xp_reward(quest_path: Path) -> int:
    """Extract xp_reward from quest frontmatter."""
    content = quest_path.read_text(encoding="utf-8")
    if content.startswith("---"):
        end = content.index("---", 3)
        frontmatter = yaml.safe_load(content[3:end])
        return int(frontmatter.get("xp_reward", 0))
    return 0


def _validate_api_key(x_internal_key: str | None) -> None:
    key = _get_api_key()
    if not key:
        raise HTTPException(status_code=500, detail="Server misconfigured: missing INTERNAL_API_KEY")
    if not x_internal_key or x_internal_key != key:
        raise HTTPException(status_code=403, detail="Forbidden: invalid or missing X-Internal-Key")


@router.post("/{quest_id}/submit")
@limiter.limit("5/minute")
async def submit_quest(
    request: Request,
    quest_id: str,
    body: SubmitRequest,
    x_internal_key: str | None = Header(None, alias="X-Internal-Key"),
):
    _validate_api_key(x_internal_key)

    quest_path, test_path = _find_quest_files(quest_id)
    if not quest_path or not test_path:
        raise HTTPException(status_code=404, detail=f"Quest '{quest_id}' not found or has no test file.")

    test_code = test_path.read_text(encoding="utf-8")
    result = grade_submission(body.code, test_code)

    if result.passed:
        xp = _get_xp_reward(quest_path)
        return SubmitSuccess(xp_earned=xp).model_dump()

    return SubmitFailure(
        error_type=result.error_type,
        hint=result.hint,
        traceback=result.traceback_str,
    ).model_dump()
