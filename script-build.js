const { exec } = require('child_process');

var argv = require('minimist')(process.argv.slice(2));

let cmd = '';

if (!!argv['path']) {
  let path = argv['path'];
  cmd = `react-scripts build ; rm -r ${path} ; mv -f build ${path}`;
} else {
  cmd = 'react-scripts build';
}

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

// yarn build --path <specify-path>           : Custom output folder build (Ex: yarn build --path ../webapp/pre-deploy)
// yarn build                                 : Default build of react
