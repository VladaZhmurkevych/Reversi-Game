import readline from 'readline';

const rl = readline.createInterface({ input: process.stdin });

setTimeout(() => {
  console.log('SUBSCRIBE');
  rl.on('line', (data) => {
    console.log('LINE => ', data);
  });
}, 5000);
