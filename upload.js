const fs = require('fs').promises;
const fetch = require('node-fetch');
const glob = require('glob-promise');
const path = require('path');

const start = async () => {
  const files = await glob('temp/*.*');

  const file = files[0];

  const data = await fs.readFile(file);
  console.log('file read', file);

  const res = await fetch('https://content.dropboxapi.com/2/files/upload', {
    method: 'post',
    body: data,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Dropbox-API-Arg': JSON.stringify({
        path: `/${path.basename(file)}`,
        mode: 'overwrite',
      }),
      'Content-Type': 'application/octet-stream',
    },
  });

  console.log(res.status, res.statusText);
};

start()
  .then(() => {
    console.log('done!');
  })
  .catch((err) => {
    console.log(err);
  });

// import { parse } from 'https://deno.land/std@0.79.0/flags/mod.ts';
// import { Buffer } from 'https://deno.land/std@0.79.0/node/buffer.ts';

// const args = parse(Deno.args);

// const { file } = args;

// const fileArray = await Deno.readFile(file);

// console.log(fileArray);

// console.log(Buffer.from(fileArray));

// const res = await fetch('https://content.dropboxapi.com/2/files/upload', {
//   method: 'post',
//   body: Buffer.from(fileArray),
//   headers: {
//     Authorization: `Bearer ${TOKEN}`,
//     'Dropbox-API-Arg': JSON.stringify({
//       path: `/${file}`,
//       mode: 'overwrite',
//       autorename: true,
//       mute: false,
//       strict_conflict: false,
//     }),
//     'Content-Type': 'application/octet-stream',
//   },
// });
// console.log(res);
