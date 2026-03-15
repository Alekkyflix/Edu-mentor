Edumentor AI: Comprehensive Chat Model Blueprint
This document outlines a detailed research and implementation roadmap to transform the Edumentor AI chat interface into a world-class, human-centric workspace.

1. The User Interface (UX/UI) Architecture
   Research & Concepts
   A premium chat interface must reduce cognitive load while maintaining engagement. Modern interfaces achieve this through spatial organization, fluid feedback, and visual hierarchy.

Adaptive Glassmorphism: Using translucent overlays with background blurs (e.g., backdrop-filter: blur(12px)) creates depth, allowing the user to maintain context of the application while focusing on the active conversation.
Streaming SSE (Server-Sent Events): Crucial for perceived performance. LLMs generate text token-by-token. Buffering the entire response causes unacceptable latency. Streaming reduces Time-To-First-Token (TTFT) to milliseconds.
Micro-interactions: Physics-based animations (springs over linear easing) make the UI feel "alive". When a new message appears, it shouldn't just "pop" in; it should smoothly slide upwards with a slight spring effect.
Implementation Plan
Frontend - SSE Integration: Transition /api/chat from a standard REST POST request to handling a stream. Use fetch with a ReadableStream reader to append tokens to the active message state in real-time.
Frontend - Math & Markdown Rendering: Integrate react-markdown with remark-math and rehype-katex. This is mandatory for an educational tool to properly render fractions, integrals, and code blocks.
Frontend - Glassmorphic Tweaks: Update the CSS variables in index.css or Tailwind config to use semi-transparent rgba backgrounds paired with backdrop-blur for the sidebar and top navigation.
Frontend - Spring Animations: Utilize Framer Motion's layout prop on message containers to ensure smooth list displacement when new messages stream in. 2. Response Quality & Multi-modality
Research & Concepts
Educational models must handle more than just text. Students take photos of homework or upload PDFs.

Multi-modality (Vision): Integrating Vision models (like GPT-4o or Gemini 1.5 Pro) allows the AI to "see" inputs. The UI must support drag-and-drop file/image attachments.
Reasoning Steps (Chain of Thought): For complex problems (e.g., calculus), showing the AI's internal scratchpad builds trust. This is often rendered as a collapsible <details> HTML block labeled "Thinking...".
Message Branching: Allowing users to edit an old message and generate a new response branch (creating a tree structure of the conversation rather than a linear list).
Implementation Plan
Frontend - Attachment Dropzone: Implement a dropzone over the ChatClient that activates on drag-enter. Show attachment thumbnails in the input bar before sending.
Backend - Multi-modal Endpoints: Update FastAPI endpoints to accept multipart/form-data or Base64 encoded images alongside text.
Frontend/Backend - Structured Output: Enforce the AI to output a specific JSON schema encapsulating "reasoning" and "final_answer". Render the "reasoning" inside a <details> tag in the chat bubble.
Frontend - Branching State: Update the local
Message
interface to support an array of children or siblings to track conversation branches, with left/right arrows to navigate between them. 3. Advanced Settings & "Brain" Control
Research & Concepts
Users, especially educators or advanced students, need control over the AI's generation parameters.

Temperature (0.0 to 1.0): Controls randomness. 0.2 is highly deterministic (ideal for exact mathematical answers). 0.8 is creative (ideal for brainstorming essay topics).
Context Window Management: LLMs get confused if the conversation history is too long. Users need a way to see how much context is being used and "flush" it if needed.
System Prompt Injection: The underlying instructions guiding the AI's behavior.
Implementation Plan
Frontend - Settings Panel: Add a gear icon leading to a "Model Settings" slide-out panel containing a slider for Temperature (labeled "Creative" to "Precise").
Backend - State Passing: The FastAPI endpoint must extract temperature and system_instruction overrides from the request body and pass them to the underlying LLM client (e.g., OpenAI or Vertex AI).
Frontend - Context Indicator: Add a subtle visual meter (e.g., a battery icon) showing how much of the context window is full. When full, prompt the user to "Archive & Start Fresh". 4. Personalization, Memory, and Core Rules
Research & Concepts
A true "Edumentor" remembers the student. It knows they struggle with fractions but excel at geometry.

Vector Memory: Using an embedding database (like Pinecone, Qdrant, or pgvector) to store past interactions and retrieve them via semantic search when relevant.
The Socratic Rule: An educational AI should almost never give the direct answer to a homework question. It should guide the student.
User Profiles: Storing metadata like grade level, preferred language, and learning style.
Implementation Plan
Backend - Socratic Guardrail: Hardcode a system prompt prefix: "You are an expert, patient Socratic tutor. NEVER provide the final answer directly. Ask guiding questions to lead the student to the answer."
Backend - Long-term Memory: Implement a background task that summarizes daily chat logs and creates embeddings. On new queries, retrieve the top 3 relevant historical facts about the student and inject them into the system prompt.
Database - Profile Schema: Create a User Profile table tracking learning_level, preferred_tone, and primary_language. Fetch these on app load and send them as headers or payload data in every chat request.
Recommended Phase Rollout
Phase 1: SSE Streaming + Markdown/Math Rendering (Highest immediate impact on user experience).
Phase 2: Socratic System Prompts + Glassmorphic UI polish.
Phase 3: Image uploads (Multi-modality).
Phase 4: Long-term Vector Memory & Message Branching.
