# node-server

easy-es 的 node 服务端

## 安装

```
$ npm ci
```

## 运行

```
$ npm start
```

> 推荐搭配 docker 运行。

## 配置

```javascript
// configs.js

module.exports = {
  port: 80,
  esHost: 'http://localhost:9200', // es host
  schema: {
    // [index] name
    default: {
      name: 5, // field name & weight for each [type]
      intro: 3,
      content: 1,
    },
  },
};
```

由于 es 对 schema 有着一定的要求，在使用时我们需要有一些格式约定：

- schema 下可以有多个 key，每个 key 表示 es 中的 index，默认只有一个'defalut'。
- 每个 index 下有若干个 key -> value，其中 key 表示 document 的字段名，value 表示关键字搜索时的权重。

举例：

```javascript
  schema: {
    paper: {
      title: 5,
      abstract: 3,
      text: 1,
    },
  },
```

以上 schema 配置表示：新建一个 index（paper）用来存储我们的论文，每个论文的字段固定为 title, abstract, text， 其中 title 的权重最高。

> 1. 权重高的字段对关键字排序的影响更大。
> 2. 您的业务数据库字段可能更复杂多变，但是 easy-es 仅仅负责全文本搜索，所以请确保保存时的数据结构符合 schema，否则可能会报错。
> 3. 如果您已经在某个 index 中存储了数据，但是又想改变该 index 的 schema，则需要先清空 index。您可能需要直接操作 elasticsearch 来删除目标 index 再重建索引或者借助 remove API 删除当前 index 下所有的文档。

## Web API

仅有四个常用 API：upsert, get, search ,remove，且全部使用 POST method。

### /upsert

用途：插入/更新 一条数据

参数

- index {string} 索引名
- type {string} 类型名
- id {string} 自定义的数据 id。请至少确保 id 对于每个 type 是唯一的，推荐全局唯一（uuid）
- data {object} 文档数据

示例

```
POST http://host/upsert
{
  index: 'default',
  type: 'user',
  id: 'user003',
  data: {
    name: '张三',
    intro: '互联网市场专员',
    content: '深度互联网从业人员，对互联网保持高度的敏感性和关注度，熟悉产品开发流程，有很强的产品规划、需求分析、交互设计能力，能独立承担APP和WEB项目的管控工作，善于沟通，贴近用户。',
  }
}
```

结果

```
{
  "_index": "default",
  "_type": "user",
  "_id": "user003",
  "_version": 1,
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  }
}
```

### /get

用途：获取单条数据

参数

- index {string} 索引名
- type {string} 类型名
- id {string} 自定义的数据 id

示例

```
POST http://host/get
{
  index: 'default',
  type: 'user',
  id: 'user003',
}
```

结果

```
{
  "_index": "default",
  "_type": "user",
  "_id": "user003",
  "_version": 1,
  "found": true,
  "_source": {
    "_updated": 1589537329275,
    "name": "张三",
    "intro": "互联网市场专员",
    "content": "深度互联网从业人员，对互联网保持高度的敏感性和关注度，熟悉产品开发流程，有很强的产品规划、需求分析、交互设计能力，能独立承担APP和WEB项目的管控工作，善于沟通，贴近用户。",
    "id": "user003"
  }
}
```

### /search

用途：按关键字查询数据

参数

- index {string} 索引名
- type {string} 类型名
- ids {null | Array\<string\>} 精确限制 id 在某范围内，可留空表示不限
- keywords {null| string | Array\<string\>} 关键字字符串或数组（表示多个关键字），留空表示不限
- includes {Array\<string\>} 需要返回的字段，默认["id"]
- from {number} 结果跳过前 N 个（skip）
- size {number} 返回数目上限（分页大小），要求小于 10k

示例

```
POST http://host/search
{
  index: 'default',
  type: 'user',
  // ids: ['user003'],
  keywords: '互联网',
  includes: ['name'],
}
```

结果

```
{
  "took": 1,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 1,
    "max_score": 7.9691935,
    "hits": [
      {
        "_index": "default",
        "_type": "user",
        "_id": "user003",
        "_score": 7.9691935,
        "_source": {
          "name": "张三"
        }
      }
    ]
  }
}
```

### /remove

用途：删除单条数据

参数

- index {string} 索引名
- type {string} 类型名
- id {string} 自定义的数据 id

示例

```
POST http://host/remove
{
  index: 'default',
  type: 'user',
  id: 'user003',
}
```

结果

```
{
  "found": true,
  "_index": "default",
  "_type": "user",
  "_id": "user003",
  "_version": 2,
  "result": "deleted",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  }
}
```
