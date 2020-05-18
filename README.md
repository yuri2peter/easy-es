# easy-es

使用 docker-compose 快速部署 elastic search，专注于文本分词搜索功能，并提供一个精简过的 API 接口足以应付大部分中小型使用场景。

## 为什么需要?

如果您也面临以下问题：

- 业务数据库逻辑复杂，互相关联，不支持关键字搜索功能。
- 本意使用 elasticsearch 来帮助业务数据库做搜索，但是维护 es-db 的同步和 es 数据结构的更新有点麻烦。
- 很多时候只是想搜索关键字而已，不想研究 es 部署和其他功能。

那么恭喜，您可以尝试 easy-es！

## 亮点

- 提供 docker-compose 模板，开箱即用。
- 仅需关注您的业务，其余细节统统隐藏。
- 无需学习 es 的任何语法。
- 不限制同步数据库的种类，甚至不需要数据库。

## 核心设计

### 数据映射

我们将业务数据的复杂格式抽象成适合文本搜索的格式，同时过滤掉不会被搜索的字段。

例如，一个用户数据，在 mongodb 中可能是这样的：

```
{
  name: '张三',
  nickName: 'San',
  address: {
    addr1: 'China',
    addr2: 'Anhui',
  },
  // A,B,C是系统中预定义的标识符，含义为 "Apple", "Banana", "Cherry"
  tags: ['A', 'B', 'C'],
  introduction: "Some introductions here...",
  details: "Some details here...",
}
```

具有字段多，字段嵌套，外键引用，权重不一等问题。

> 如果您的系统还维护了另一种类似的数据结构如 vip 用户，比起普通用户多了或少了几个字段？
>
> 如果我们搜索时还要考虑用户相关的文学作品的标题，然而这些作品又是用其他业务数据库甚至第三方 API 接口联查得到的？

Easy-es 会推荐您将所有“人”建立一个索引"Person"，然后针对不同的人建立不同的"type"(如 vip1, vip2)，所有 Person 具有完全相同的数据结构，如:

```
{
  name: '张三 San',
  intro: 'Apple Banana Cherry China Anhui Some introductions here...',
  details: 'Some details here...',
}
```

注意我们将原数据结构的各个字段按照语义映射为 3 个简单的字段。

这样做有什么好处？

- 与业务数据库的形态无关，我们只需要在恰当的时机（例如原数据更新后，或每晚 12 点）主动更新 es 中的数据。
- 十分规整的数据结构，查询稳定高效。
- 数据库查询和关键字查询的结合将变得更加简单，除了按大类（type）查询外，easy-es 还支持传入每条数据的 id 作筛选。也就是说您可以先用传统方式精确查询出一批数据的 id，再交由 easy-es 针对关键字进一步筛选并按权重排序。

## 快速上手

1. 参考目录下的`docker-compose.yml`文件建立 docker-compose 集群，运行 node 服务端容器和 es 容器。
2. 修改服务端配置文件`configs.js`并重启服务。
3. 查看[服务端文档](./src/README.md)并集成服务端 API 至您的业务系统。

That's all!

## 其他

- Es 请保持默认的版本，其他版本的兼容性不作承诺。
- 您可能会需要直接操作 es 或使用 kibala，修改`docker-compose.yml`文件开启相关容器和端口即可。
- 请注意项目本身并未附带任何权限验证的手段，不要暴露端口到公网。
- 该项目是核心理念是 业务数据-> es 的单向映射，并不推荐直接替代您的业务数据库。
- 如果有需求，可以自行修改服务端代码。
- 本项目遵循 [Apache License](./LICENSE)。
- 特别鸣谢 sen.zhang 对早期项目做出的贡献。

> 如果您觉得这个项目有价值，不妨点个星星再走吧 :)
