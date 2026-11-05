// api.js - fetch game data
// api.js - fetch game data from local Express endpoint (Claude generated)
export async function fetchGameData() {
  try {
    const response = await fetch('/api/questions');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error('Failed to load game data from Claude API:', err);
    return { gameTitle: 'Leitura Datashow', questions: [] };
  }
}


