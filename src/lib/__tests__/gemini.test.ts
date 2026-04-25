import { explainConcept, checkFact, summarizeManifesto } from '../gemini';

global.fetch = jest.fn();

describe('gemini', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.GOOGLE_GEMINI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    delete process.env.GOOGLE_GEMINI_API_KEY;
  });

  it('explainConcept calls gemini with correct prompt', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'This is an explanation.' }] } }]
      })
    });

    const result = await explainConcept('What is democracy?', 'English', true);
    expect(result).toBe('This is an explanation.');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const fetchArgs = (global.fetch as jest.Mock).mock.calls[0];
    expect(fetchArgs[0]).toContain('test-api-key');
    expect(JSON.parse(fetchArgs[1].body).contents[0].parts[0].text).toContain('What is democracy?');
  });

  it('checkFact parses JSON response correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '{"verdict":"TRUE","confidence":95,"reasoning":"Because it is.","points":["point 1"]}' }] } }]
      })
    });

    const result = await checkFact('The sun is hot');
    expect(result).toEqual({
      verdict: 'TRUE',
      confidence: 95,
      reasoning: 'Because it is.',
      points: ['point 1'],
      claim: 'The sun is hot'
    });
  });

  it('summarizeManifesto calls gemini', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Summary of manifesto.' }] } }]
      })
    });

    const result = await summarizeManifesto('We will build roads.', 'Candidate A', false);
    expect(result).toBe('Summary of manifesto.');
  });

  it('throws error if API key is missing', async () => {
    delete process.env.GOOGLE_GEMINI_API_KEY;
    await expect(explainConcept('Test', 'English', false)).rejects.toThrow('GOOGLE_GEMINI_API_KEY not configured');
  });

  it('throws error if API responds with error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await expect(explainConcept('Test', 'English', false)).rejects.toThrow('Gemini API error: 500');
  });
});
