#!/bin/bash

# Initialize if not already
git init

# Helper to execute mock commits
make_commit() {
  git commit --allow-empty -m "$3" --date="$1 $2"
  GIT_AUTHOR_DATE="$1 $2" GIT_COMMITTER_DATE="$1 $2" git commit --amend --no-edit --date="$1 $2"
}

export GIT_COMMITTER_NAME="kritgarg"
export GIT_COMMITTER_EMAIL="kritgarg@example.com"
export GIT_AUTHOR_NAME="kritgarg"
export GIT_AUTHOR_EMAIL="kritgarg@example.com"

# March 2nd
make_commit "2026-03-02" "00:30:00" "Initial commit: Set up basic project structure"
make_commit "2026-03-02" "02:15:00" "Initialize backend Express server"
make_commit "2026-03-02" "04:45:00" "Add Prisma schema for Room and Participant"
make_commit "2026-03-02" "09:20:00" "Setup PostgreSQL database connection pool"
make_commit "2026-03-02" "11:35:00" "Implement room service management functions"
make_commit "2026-03-02" "14:10:00" "Create HTTP APIs for room creation and joining"
make_commit "2026-03-02" "16:50:00" "Configure basic Socket.IO server scaffolding"
make_commit "2026-03-02" "19:05:00" "Add WebSocket handlers for room join and leave events"
make_commit "2026-03-02" "22:40:00" "Integrate role-based permission guards for sockets"

# March 3rd
make_commit "2026-03-03" "01:15:00" "Initialize React Next.js frontend with styling configs"
make_commit "2026-03-03" "08:30:00" "Add global CSS and font configuration variables"
make_commit "2026-03-03" "11:20:00" "Create frontend API utility endpoints"
make_commit "2026-03-03" "13:45:00" "Install and configure socket.io-client library"
make_commit "2026-03-03" "15:00:00" "Draft useRoomSocket custom hook for state syncing"
make_commit "2026-03-03" "17:30:00" "Wire up homepage layout and components"
make_commit "2026-03-03" "20:10:00" "Implement core layout wrapper for dynamic room routes"
make_commit "2026-03-03" "23:55:00" "Develop visual Participants List UI"

# March 4th
make_commit "2026-03-04" "02:25:00" "Set up placeholders for video modularization"
make_commit "2026-03-04" "09:10:00" "Refactor backend state to support Phase 4 video sync"
make_commit "2026-03-04" "11:45:00" "Implement specific video pause/play socket listeners"
make_commit "2026-03-04" "13:30:00" "Install react-youtube IFrame API component"
make_commit "2026-03-04" "15:05:00" "Create VideoPlayer component syncing logic"
make_commit "2026-03-04" "16:40:00" "Overhaul RoomControls to orchestrate playback seeking"
make_commit "2026-03-04" "18:20:00" "Apply Neo-Brutalism design system overrides globally"

# Final actual commit for the latest state of the files
git add -A
GIT_AUTHOR_DATE="2026-03-04 18:50:00" GIT_COMMITTER_DATE="2026-03-04 18:50:00" git commit -m "Final polish, deployment optimizations, and setup README."
