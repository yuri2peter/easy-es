module.exports = {
  port: 80,
  esHost: 'http://elasticsearch:9200', // es host
  schema: {
    // [index] name
    default: {
      name: 5, // field name & weight for each [type]
      intro: 3,
      content: 1,
    },
  },
};
