#!/bin/bash
# Claude Code Skill Tree — PostToolUse Hook
# Detects skill completions and updates progress

set -e

PROGRESS_FILE="$HOME/claude-skill-tree/data/progress.json"
SKILLS_FILE="$HOME/claude-skill-tree/data/skills.json"

# Read JSON from stdin
INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
NEW_STRING=$(echo "$INPUT" | jq -r '.tool_input.new_string // empty')
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
URL=$(echo "$INPUT" | jq -r '.tool_input.url // empty')
NODE_ID=$(echo "$INPUT" | jq -r '.tool_input.nodeId // empty')

# Bail if no tool name
[ -z "$TOOL_NAME" ] && exit 0

# Ensure progress file exists
if [ ! -f "$PROGRESS_FILE" ]; then
  echo '{"skills":{},"figma_node_ids":[],"totalCompleted":0,"lastUpdated":null}' > "$PROGRESS_FILE"
fi

# Load current progress
PROGRESS=$(cat "$PROGRESS_FILE")

# Check if a skill is already completed
is_completed() {
  echo "$PROGRESS" | jq -r --arg id "$1" '.skills[$id].completed // false' 2>/dev/null
}

# Check if prerequisite skills are met
prereqs_met() {
  local skill_id="$1"
  local prereqs
  prereqs=$(jq -r --arg id "$skill_id" '.[] | select(.id == $id) | .prerequisites[]' "$SKILLS_FILE" 2>/dev/null)
  for prereq in $prereqs; do
    if [ "$(is_completed "$prereq")" != "true" ]; then
      return 1
    fi
  done
  return 0
}

# Unlock a skill
unlock_skill() {
  local skill_id="$1"
  local skill_name="$2"

  # Don't re-unlock
  [ "$(is_completed "$skill_id")" = "true" ] && return 0

  local timestamp
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  # Update progress atomically
  local tmp_file="${PROGRESS_FILE}.tmp"
  echo "$PROGRESS" | jq \
    --arg id "$skill_id" \
    --arg ts "$timestamp" \
    '.skills[$id] = { "completed": true, "timestamp": $ts, "detected_by": "hook" } |
     .totalCompleted = ([.skills | to_entries[] | select(.value.completed == true)] | length) |
     .lastUpdated = $ts' > "$tmp_file"
  mv "$tmp_file" "$PROGRESS_FILE"

  # Reload progress for subsequent checks
  PROGRESS=$(cat "$PROGRESS_FILE")

  # Notify the web server to push SSE update
  curl -s -X POST http://localhost:3456/api/notify > /dev/null 2>&1 &

  # macOS notification + sound
  osascript \
    -e "display notification \"$skill_name\" with title \"Skill Unlocked!\"" \
    -e 'do shell script "afplay /System/Library/Sounds/Hero.aiff &"' &

  return 0
}

# Combined text for file content checks
FILE_CONTENT="$CONTENT $NEW_STRING"

UNLOCKED=""

# --- Skill 1: Create a New Project ---
if [ "$TOOL_NAME" = "Bash" ] && [ "$(is_completed "create-project")" != "true" ]; then
  if echo "$COMMAND" | grep -qE '(mkdir\s+|npx\s+create-|npm\s+init|yarn\s+create|pnpm\s+create)'; then
    unlock_skill "create-project" "Create a New Project"
  fi
fi

# --- Skill 2: Run a Dev Server ---
if [ "$TOOL_NAME" = "Bash" ] && [ "$(is_completed "run-dev-server")" != "true" ]; then
  if echo "$COMMAND" | grep -qE '(npm\s+(run\s+)?(dev|start|serve)|npx\s+(vite|next|serve|live-server|http-server)|python.*http\.server|yarn\s+(dev|start)|node\s+.*server)'; then
    unlock_skill "run-dev-server" "Run a Dev Server"
  fi
fi

# --- Skill 3: Use Screenshots ---
if [ "$(is_completed "use-screenshots")" != "true" ]; then
  if echo "$TOOL_NAME" | grep -qE '^mcp__playwright__browser_(take_screenshot|snapshot)$'; then
    unlock_skill "use-screenshots" "Use Screenshots for Feedback"
  fi
fi

# --- Skill 4: Set Up GitHub ---
if [ "$TOOL_NAME" = "Bash" ] && [ "$(is_completed "setup-github")" != "true" ]; then
  if echo "$COMMAND" | grep -qE '(git\s+remote\s+add|gh\s+repo\s+create|git\s+clone\s+|git\s+init)'; then
    unlock_skill "setup-github" "Set Up GitHub"
  fi
fi

# --- Skill 5: Use a Branch ---
if [ "$TOOL_NAME" = "Bash" ] && [ "$(is_completed "use-branch")" != "true" ]; then
  if echo "$COMMAND" | grep -qE '(git\s+checkout\s+-b\s+|git\s+switch\s+-c\s+)'; then
    unlock_skill "use-branch" "Use a GitHub Branch"
  fi
fi

# --- Skill 6: Push to Main ---
if [ "$TOOL_NAME" = "Bash" ] && [ "$(is_completed "push-to-main")" != "true" ]; then
  if echo "$COMMAND" | grep -qE '(git\s+push(\s+(-u\s+)?origin)?\s+(main|master)|gh\s+pr\s+merge)'; then
    unlock_skill "push-to-main" "Push to Main"
  fi
fi

# --- Skill 7: Connect Figma MCP ---
if [ "$(is_completed "connect-figma")" != "true" ]; then
  if echo "$TOOL_NAME" | grep -qE '^mcp__figma-desktop__'; then
    unlock_skill "connect-figma" "Connect Figma MCP"
  fi
fi

# --- Skill 8: Build a Screen from Figma ---
if [ "$(is_completed "build-from-figma")" != "true" ]; then
  if [ "$TOOL_NAME" = "mcp__figma-desktop__get_design_context" ]; then
    unlock_skill "build-from-figma" "Build a Screen from Figma"
  fi
fi

# --- Skill 9: Iterate with Screenshots ---
if [ "$(is_completed "iterate-with-screenshots")" != "true" ]; then
  if [ "$(is_completed "build-from-figma")" = "true" ] && [ "$(is_completed "use-screenshots")" = "true" ]; then
    if echo "$TOOL_NAME" | grep -qE '^mcp__playwright__browser_(take_screenshot|snapshot)$'; then
      unlock_skill "iterate-with-screenshots" "Iterate with Screenshots"
    fi
  fi
fi

# --- Skill 10: Build Multiple Screens ---
if [ "$(is_completed "build-multiple-screens")" != "true" ]; then
  if [ "$TOOL_NAME" = "mcp__figma-desktop__get_design_context" ] && [ -n "$NODE_ID" ]; then
    # Track unique node IDs
    local_ids=$(echo "$PROGRESS" | jq -r '.figma_node_ids // []')
    already_has=$(echo "$local_ids" | jq --arg nid "$NODE_ID" '[.[] | select(. == $nid)] | length')
    if [ "$already_has" = "0" ]; then
      tmp_file="${PROGRESS_FILE}.tmp"
      echo "$PROGRESS" | jq --arg nid "$NODE_ID" '.figma_node_ids += [$nid]' > "$tmp_file"
      mv "$tmp_file" "$PROGRESS_FILE"
      PROGRESS=$(cat "$PROGRESS_FILE")
    fi
    id_count=$(echo "$PROGRESS" | jq '.figma_node_ids | length')
    if [ "$id_count" -ge 2 ]; then
      unlock_skill "build-multiple-screens" "Build Multiple Screens"
    fi
  fi
fi

# --- Skill 11: Create a Chatbot (LLM Key) ---
if [ "$(is_completed "create-chatbot")" != "true" ]; then
  matched=false
  if [ "$TOOL_NAME" = "Bash" ]; then
    if echo "$COMMAND" | grep -qE '(npm\s+install.*(openai|anthropic|@google\/generative|@ai-sdk)|OPENAI_API_KEY|ANTHROPIC_API_KEY|GEMINI_API_KEY)'; then
      matched=true
    fi
  fi
  if echo "$TOOL_NAME" | grep -qE '^(Write|Edit)$'; then
    if echo "$FILE_CONTENT" | grep -qE '(OPENAI_API_KEY|ANTHROPIC_API_KEY|GEMINI_API_KEY|sk-[a-zA-Z0-9]{20,})'; then
      matched=true
    fi
    if echo "$FILE_PATH" | grep -qE '\.env'; then
      if echo "$FILE_CONTENT" | grep -qiE '(api.?key|secret)'; then
        matched=true
      fi
    fi
  fi
  if [ "$matched" = "true" ]; then
    unlock_skill "create-chatbot" "Create a Chatbot (LLM Key)"
  fi
fi

# --- Skill 12: Use Playwright to Test ---
if [ "$(is_completed "use-playwright")" != "true" ]; then
  if [ "$TOOL_NAME" = "mcp__playwright__browser_navigate" ]; then
    if echo "$URL" | grep -qE '(localhost|127\.0\.0\.1)'; then
      unlock_skill "use-playwright" "Use Playwright to Test"
    fi
  fi
fi

# --- Skill 13: Deploy ---
if [ "$TOOL_NAME" = "Bash" ] && [ "$(is_completed "deploy")" != "true" ]; then
  if echo "$COMMAND" | grep -qE '(netlify\s+deploy|vercel(\s|$)|npm\s+run\s+deploy|firebase\s+deploy|gh-pages|surge\s+|fly\s+deploy|wrangler\s+(deploy|publish)|railway\s+up)'; then
    unlock_skill "deploy" "Deploy to a Public URL"
  fi
fi

# --- Skill 14: Edit CLAUDE.md ---
if [ "$(is_completed "edit-claude-md")" != "true" ]; then
  if echo "$TOOL_NAME" | grep -qE '^(Write|Edit)$'; then
    if echo "$FILE_PATH" | grep -qE 'CLAUDE\.md$'; then
      unlock_skill "edit-claude-md" "Edit CLAUDE.md"
    fi
  fi
fi

# --- Skill 15: Create INTENT.md ---
if [ "$(is_completed "create-intent-md")" != "true" ]; then
  if echo "$TOOL_NAME" | grep -qE '^(Write|Edit)$'; then
    if echo "$FILE_PATH" | grep -qE 'INTENT\.md$'; then
      unlock_skill "create-intent-md" "Create INTENT.md"
    fi
  fi
fi

# --- Skill 16: Create a Claude Skill ---
if [ "$(is_completed "create-skill")" != "true" ]; then
  if echo "$TOOL_NAME" | grep -qE '^Write$'; then
    if echo "$FILE_PATH" | grep -qE '\.claude/(commands|skills)/.*\.(md|yaml)$'; then
      unlock_skill "create-skill" "Create a Claude Skill"
    fi
  fi
fi

exit 0
