const axios = require('axios');

async function test() {
  // add user001
  await axios
    .post('http://localhost/upsert', {
      index: 'default',
      type: 'user',
      id: 'user001',
      data: {
        name: 'Yuri2',
        intro: 'Author of the project.',
        content: 'I love "Titanic"!',
      },
    })
    .then(res => {
      console.log(JSON.stringify(res.data, ' ', 2));
    });

  // add user002
  await axios
    .post('http://localhost/upsert', {
      index: 'default',
      type: 'user',
      id: 'user002',
      data: {
        name: 'Uncle Bob',
        intro: 'Author of "Titanic"',
        content:
          "We saw Uncle Bob's paintings there.\n我们在那里看到了鲍勃叔叔的画。",
      },
    })
    .then(res => {
      console.log(JSON.stringify(res.data, ' ', 2));
    });

  // do some queries
  await axios
    .post('http://localhost/search', {
      index: 'default',
      type: 'user',
      keywords: 'Titanic',
    })
    .then(res => {
      console.error(JSON.stringify(res.data, ' ', 2));
    });
}

test();
