const axios = require('axios');
const configs = require('../configs');

function getTime() {
  return new Date().getTime();
}

function getIndexSchema(index) {
  return configs.schema[index];
}

function throwErrorIndexNotDefined() {
  throw new Error('Index is not defined in the schema.');
}

function formatData(schema, data = {}) {
  const formatted = {};
  const fields = Object.keys(schema);
  fields.forEach(field => {
    formatted[field] = typeof data[field] === 'string' ? data[field] : '';
  });
  return formatted;
}

async function upsert({ index, type, id, data }) {
  const indexSchema = getIndexSchema(index);
  if (!indexSchema) throwErrorIndexNotDefined();
  const url = `${configs.esHost}/${index}/${type}/${id}/_update`;
  return axios
    .post(url, {
      doc: {
        _updated: getTime(),
        ...formatData(indexSchema, data),
        id: id + '',
      },
      doc_as_upsert: true,
    })
    .then(res => {
      return res.data;
    });
}

async function remove({ index, type, id }) {
  const url = `${configs.esHost}/${index}/${type}/${id}`;
  return axios.delete(url).then(res => {
    return res.data;
  });
}

async function get({ index, type, id }) {
  const url = `${configs.esHost}/${index}/${type}/${id}`;
  return axios.get(url).then(res => {
    return res.data;
  });
}

async function search({
  index, // 索引
  type, // 类型
  ids, // 可以是id数组或空
  keywords, // 可以是字符串或字符串数组
  includes = ['id'], // 文档所要包含的字段
  from = 0, // 起点
  size = 10000, // 单页数量
}) {
  const indexSchema = getIndexSchema(index);
  if (!indexSchema) throwErrorIndexNotDefined();
  const url = `${configs.esHost}/${index}${type ? '/' + type : ''}/_search`;
  let body;
  // 处理body
  (() => {
    body = {
      query: {
        bool: {},
      },
      _source: includes,
      from,
      size,
    };
    const matchArray = [];
    const queryList = Object.keys(indexSchema).map(field => ({
      field,
      boost: indexSchema[field],
    }));
    queryList.map(t =>
      (keywords ? (Array.isArray(keywords) ? keywords : [keywords]) : []).map(
        keyword =>
          matchArray.push({
            match_phrase: { [t.field]: { query: keyword, boost: t.boost } },
          }),
      ),
    );

    if (ids) {
      const filterBody = {
        terms: {
          id: ids,
        },
      };
      const matchBody = {
        bool: {},
      };
      matchBody.bool.should = matchArray;
      body.query.bool.must = [matchBody, filterBody];
      body.size = ids.length;
    } else {
      body.query.bool.should = matchArray;
    }
  })();

  return axios.post(url, body).then(res => {
    return res.data;
  });
}

module.exports = {
  upsert,
  remove,
  get,
  search,
};
