import axios from 'axios';

export const generateAIResponse = async (prompt: string, apiKey: string): Promise<string> => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: prompt,
        max_tokens: 50, // Adjust the desired length of the AI response
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const aiResponse = response.data.choices[0].text.trim();
    return aiResponse;
  } catch (error) {
    console.error('Error retrieving AI response:', error);
    return '';
  }
};