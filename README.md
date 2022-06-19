# Aboard
Aboard is a board, not abroad

## 鉴权

建立连接的http请求头中携带以下参数

| 字段 | 类型   | 可空 | 说明                  |
| ---- | ------ | ---- | --------------------- |
| name | string | 否   | 用户的用户名，URL编码 |

## 心跳

服务器莓30秒发送一次ping，若客户端发现两次ping时间间隔过长，则可能是与服务器连接断开。服务器将主动关闭无法回应ping的连接。

## 数据包约定

所有数据包均为json字符串。同时只能订阅一个对象。

### 请求数据包结构

```
{
  o: "topic.list", // 操作标识
  d: { ... }, // 请求数据，对象类型，就算没有请求数据也必须有一个空对象
  i: "" // 请求记号，任意类型，响应时会原封不动返回
}
```

### 响应数据包结构

```
{
  e: "", // 错误信息，文本类型
  d: { ... }, // 返回数据，根据功能具体定义，e和d必有其一
  i: "" // 请求记号
}
```

### 事件数据包结构

可用是否有o字段和响应数据区别开

```
{
  o: "topic.create", // 事件标识
  d: { ... } // 事件数据，根据功能具体定义
  i: "" // 事件记号，需要在ACK中原样返回
}
```

### 事件ACK包结构

在收到每个事件数据包后请立即发送ACK包，超时将视为心跳丢失，连接将被服务器主动关闭

```
{
  i: "" // 事件记号
}
```



## 操作

未标明是否可空的默认不可空

### `topic.list`

获取并订阅topic列表

#### 请求数据

| 字段    | 类型              | 可空                      | 说明                                           |
| ------- | ----------------- | ------------------------- | ---------------------------------------------- |
| begTime | int(timestamp-ms) | 是，空时表示获取最新topic | 获取的topic的最早时间（不含）                  |
| count   | int               | 是，默认20                | 获取的条目数，超过50当作50处理，小于0当作0处理 |

#### 响应数据

一个数组，表示获取到的topic对象列表。topic对象结构如下

| 字段     | 类型              | 说明         |
| -------- | ----------------- | ------------ |
| _id      | string            | topic id     |
| title    | string            | topic标题    |
| time     | int(timestamp-ms) | 发布时间     |
| username | string            | 发布者用户名 |

### `topic.create`

创建topic，并向订阅topic列表的用户广播

#### 请求数据

| 字段    | 类型   | 说明      |
| ------- | ------ | --------- |
| title   | string | topic标题 |
| content | string | topic内容 |

#### 响应数据

一个字符串，表示新topic的id

### `topic.get`

获取某个topic的详细信息，并订阅该topic的评论

#### 请求数据

| 字段  | 类型   | 说明                    |
| ----- | ------ | ----------------------- |
| topic | string | 要获取和订阅的topic的id |

#### 响应数据

topic对象，定义如下

| 字段     | 类型              | 说明         |
| -------- | ----------------- | ------------ |
| _id      | string            | topic id     |
| title    | string            | topic标题    |
| content  | string            | topic内容    |
| time     | int(timestamp-ms) | 发布时间     |
| username | string            | 发布者用户名 |

### `comment.list`

获取某个topic的comment列表。显然，回复某条comment的comment一定出现在它回复的comment之后。

#### 请求数据

| 字段    | 类型              | 可空                        | 说明                                           |
| ------- | ----------------- | --------------------------- | ---------------------------------------------- |
| topic   | string            | 否                          | topic id                                       |
| begTime | int(timestamp-ms) | 是，空时表示获取最新comment | 获取的comment的最早时间（不含）                |
| count   | int               | 是，默认20                  | 获取的条目数，超过50当作50处理，小于0当作0处理 |

#### 响应数据

comment对象，定义如下

| 字段     | 类型              | 说明              |
| -------- | ----------------- | ----------------- |
| _id      | string            | comment id        |
| topic    | string            | topic id          |
| content  | string            | 内容              |
| time     | int(timestamp-ms) | 发布时间          |
| username | string            | 发布者用户名      |
| reply    | string            | 回复的comment的id |

### `comment.create`

发布comment，并向订阅对应topic的人广播

#### 请求数据

| 字段    | 类型   | 可空                 | 说明              |
| ------- | ------ | -------------------- | ----------------- |
| topic   | string | 否                   | topic id          |
| content | string | 否                   | 内容              |
| reply   | string | 是，空字符串即非回复 | 回复的comment的id |

#### 响应数据

一个字符串，表示comment的id

## 事件

### `topic.create`

当topic被创建时，向订阅topic列表的用户发送

#### 事件数据

topic对象，定义如下

| 字段     | 类型              | 说明         |
| -------- | ----------------- | ------------ |
| _id      | string            | topic id     |
| title    | string            | topic标题    |
| time     | int(timestamp-ms) | 发布时间     |
| username | string            | 发布者用户名 |

### `comment.create`

当一条comment被发布时，向订阅对应topic的用户发送

#### 事件数据

comment对象，定义如下

| 字段     | 类型              | 说明                                |
| -------- | ----------------- | ----------------------------------- |
| _id      | string            | comment id                          |
| topic    | string            | topic id                            |
| content  | string            | 内容                                |
| time     | int(timestamp-ms) | 发布时间                            |
| username | string            | 发布者用户名                        |
| reply    | string            | 回复的comment的id，空字符串即非回复 |
