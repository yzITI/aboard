# Aboard

Aboard is a board, not abroad

## Model

```js
block {
  _id: 'random string',
  time: Date.now(),
  user: 'userid',
  parent: 'blockid',
  surface: { // all surface information
    title: 'title',
    type: 'block type',
    author: 'display user name',
    value: 'text or other kinds of value'
  },
  volume: { // longer content of block
    value: 'text or other kinds of value'
  }
}
```

> `_id = ''` is the root block, it is created automatically.

## Transfer Protocol

```js
Request {
  "N": "block.funcName",
  "A": ["parameters", "value"]
}

Event {
  "N": "func.name",
  "A": ["data"]
}
```

### Requests

- `auth(jwt)` authentication

- `block.get(_id)` get information of a block (surface & volume) as well as the children's surface information
- `block.put(_id, block)` post a new block as a children of `_id`
- `block.del(_id)` remove a block and all its subtree

### Events

- `auth()` successfully auth

- `block.one(block)` full information of block (surface & volume)
- `block.children(blockid, {})` **surface** information of block children
- `block.removeChildren(blockid, childrenid)` remove a children from block
- `block.error(blockid)` current block has error
