# Research Assistant

A chat-based research assistant that answers factual questions by searching the web in real time and lets you save findings as persistent notes.

## What it does

- **Web search answers** — ask any factual question and the assistant queries the web via Tavily, then returns a concise, cited response (inline `[1]`, `[2]` references + a Sources section)
- **Conversation memory** — each chat session keeps context across turns so you can follow up naturally
- **Notes** — tell the assistant to "save" anything and it stores a timestamped note in your browser's localStorage; notes persist across page reloads and can be deleted individually

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| AI agent | LangChain + LangGraph (`createAgent`, `MemorySaver`) |
| LLM | Haiku 4.5 via Anthropic API |
| Web search | Tavily API |
| Language | TypeScript |

## Running locally

**Prerequisites:** Node.js 20+, Yarn

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Create `.env.local` in the project root and add your API keys:
   ```
   ANTHROPIC_API_KEY=your_anthropic_key
   TAVILY_API_KEY=your_tavily_key
   ```

3. Start the dev server:
   ```bash
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
