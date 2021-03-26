const rl = require('readline').createInterface({input:process.stdin,output:process.stdout});
const http = require('http');
const fs = require('fs');
const Sound = require('node-wav-player');
const host = process.argv[2];
const port = process.argv[3] || 25565;
const doit = () => new Promise(resolve => {
  rl.question("You: ", (data) => {
    const req = http.request({hostname:host,port:port,method:'POST',path:'/talk'}, res => {
      res.on('data', d => {
        const wavReq = http.request({hostname:host,port:port,method:'GET',path:'/output/output.wav'}, wavRes => {
          const file = fs.createWriteStream('output.wav');
          wavRes.on('end', () => {
            file.close(() => {
              Sound.play({path:'output.wav'})
              resolve(console.log('James Numbers: ', d.toString()));
            });
          });
          wavRes.pipe(file);
        });
        wavReq.on('error', (err) => {
          resolve(console.log('error', err));
        });
        wavReq.write('');
        wavReq.end();
      })
    });
    req.write(JSON.stringify({data:data}));
    req.end();
  });
});
(async () => {
  while(true) {
    await doit();
  }
})()