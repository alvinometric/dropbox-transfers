import 'dotenv/config';
import { basename } from 'path';
import fs from 'node:fs/promises';
import fetch from 'node-fetch';
import glob from 'glob-promise';

const start = async () => {
  const { TOKEN } = process.env;
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
        path: `/${basename(file)}`,
        mode: 'overwrite',
      }),
      'Content-Type': 'application/octet-stream',
    },
  });

  if (res.ok) {
    console.log(res.status, res.statusText);
  }

  // it failed
  const err = await res.text();
  throw new Error(err);
};

start()
  .then(() => {
    console.log('File uploaded!');
  })

  .catch((err) => {
    console.log(err);
  });
