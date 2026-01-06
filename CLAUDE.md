# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the content repository for **Dartmouth CS52: Full-Stack Web Development** (Winter 2026). It contains course materials managed by the classmoji platform and exported from Notion.

## Structure

- `.classmoji/manifest.json` - Defines course modules, assignments, page mappings, and slide references
- `pages/` - Contains HTML pages and assets for each assignment/topic
  - Each subdirectory has an `index.html` and optional `assets/` folder

## Manifest Structure

The manifest organizes content into modules with pages, slides (reveal.js), and assignments:
- **Labs**: lab-1 through lab-5 (landing page, quiz, react-notes, platform frontend/API)
- **Short Assignments (SA)**: sa0-sa6 (hello-world, starterpack, react intro, routing, state management, kahoot API)
- **Projects**: project-1 through project-7 (team milestones from first meeting to final submission)
- **Extra Credit (ECSA)**: git-map, websockets, react-native, image uploads, API testing, authentication
- **General**: standalone pages like logistics, projects overview, and cypress testing intro

## Content Formats

**Pages**: HTML files with inline CSS styling, featuring:
- Code blocks with syntax highlighting (`.code-block`)
- Terminal blocks for command examples (`.terminal-block`)
- Callouts/alerts for important information
- Profile cards, embedded videos, and images in `assets/` directories

**Slides**: Reveal.js presentations (referenced in manifest but stored/managed separately)

## No Build System

This is a static content repository. Content is authored in Notion and exported to HTML by classmoji.
