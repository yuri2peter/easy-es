const axios = require('axios');

axios
  .post('http://localhost/search', {
    index: 'default',
    // keywords: '尤里',
  })
  .then(res => {
    console.error(JSON.stringify(res.data, ' ', 2));
  })
  .catch(res => {
    console.error(res.response.data);
  });
