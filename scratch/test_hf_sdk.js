import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.VITE_AI_TOKEN);

async function test() {
  console.log('Using token:', process.env.VITE_AI_TOKEN ? 'Yes' : 'No');
  try {
    const result = await hf.textGeneration({
      model: 'gpt2',
      inputs: 'The capital of France is',
    });
    console.log('Result:', result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
