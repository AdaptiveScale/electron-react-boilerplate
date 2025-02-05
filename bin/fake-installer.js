#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Welcome to the Fake Installer CLI! 🚀');

rl.question('Do you want to install FakeSoftware? (Y/N): ', (answer) => {
  if (answer.toLowerCase() !== 'y') {
    console.log('Installation aborted.');
    rl.close();
    return;
  }

  console.log('\nInstalling FakeSoftware...');
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 20;
    process.stdout.write(
      `\rProgress: [${'='.repeat(progress / 10)}${' '.repeat(10 - progress / 10)}] ${progress}%`,
    );

    if (progress >= 100) {
      clearInterval(progressInterval);
      console.log('\nInstallation complete! ✅');
      console.log("You can now use FakeSoftware with 'fake-cli run'");
      rl.close();
    }
  }, 1000);
});
