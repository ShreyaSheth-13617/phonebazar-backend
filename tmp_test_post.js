const fs = require('fs');
const path = require('path');

(async()=>{
  const fd = new FormData();
  fd.append('name','NameX');
  fd.append('brand','BrandX');
  fd.append('price','12');
  const filePath = path.join(__dirname,'README.md');
  if(fs.existsSync(filePath)) fd.append('images', fs.createReadStream(filePath));
  const res = await fetch('http://localhost:5000/api/products', {
    method:'POST',
    headers:{ Authorization:'Bearer invalidtoken' },
    body: fd
  });
  const body = await res.text();
  console.log('status',res.status);
  console.log('body',body);
})().catch(e=>{console.error('err',e)});
