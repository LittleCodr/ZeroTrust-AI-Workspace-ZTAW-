// ── Prompt Templates for LocalMind ───────────────────────────

export function buildSummarizePrompt(documentText: string): string {
  return `You are a helpful assistant that summarizes documents clearly and concisely.

DOCUMENT:
"""
${documentText}
"""

INSTRUCTIONS:
Provide a concise summary of the above document. Structure your response as:
1. A brief one-paragraph overview
2. Key points as bullet points
3. Any critical insights or conclusions

Be thorough but concise. Focus on the most important information.`
}

export function buildExplainPrompt(documentText: string): string {
  return `You are a helpful assistant that explains complex content in simple, easy-to-understand language.

DOCUMENT:
"""
${documentText}
"""

INSTRUCTIONS:
Explain the above content in simple, plain English. Follow these guidelines:
- Break down complex concepts into simple terms
- Use analogies where helpful
- Explain any technical jargon
- Structure your explanation logically from basic to advanced concepts
- Use short paragraphs for readability

Make this understandable to someone with no prior knowledge of the topic.`
}

export function buildQuestionPrompt(
  documentText: string,
  question: string
): string {
  return `You are a helpful assistant that answers questions based ONLY on the provided context.

CONTEXT:
"""
${documentText}
"""

USER QUESTION: ${question}

INSTRUCTIONS:
- Answer the question using ONLY information from the provided context above
- If the answer is not found in the context, clearly state: "I couldn't find the answer to this in the provided document."
- Do NOT make up information or use external knowledge
- Be specific and cite relevant parts of the context when possible
- Keep your answer clear and well-structured`
}

export type ActionType = 'summarize' | 'explain' | 'ask'

export function buildPrompt(
  action: ActionType,
  documentText: string,
  question?: string
): string {
  switch (action) {
    case 'summarize':
      return buildSummarizePrompt(documentText)
    case 'explain':
      return buildExplainPrompt(documentText)
    case 'ask':
      return buildQuestionPrompt(documentText, question ?? '')
    default:
      return buildSummarizePrompt(documentText)
  }
}
