import axios from 'axios';

export const generateAIResponse = async (prompt: string, apiKey: string): Promise<string> => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci/completions',
      {
        prompt: `${prompt}`,
        max_tokens: 200, // Adjust the desired length of the AI response
        temperature: 0.7, // Adjust the temperature for controlling the randomness of the response
        top_p: 1, // Adjust the top-p (nucleus) sampling for better response quality
        frequency_penalty: 0.2, // Adjust the frequency penalty for avoiding repetitive responses
        presence_penalty: 0.5, // Adjust the presence penalty for encouraging diverse responses
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