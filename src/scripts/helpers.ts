export function logOutput(err, stdout, stderr) {
  if (err) {
    console.error('ERROR: ', err);

    return;
  }

  if (stdout) {
    console.log('\n--------STDOUT LOGS--------- \n');
    console.log(stdout);
  }

  if (stderr) {
    console.error('\n--------STDERR LOGS--------- \n');
    console.error(stderr);
  }
}
