module.exports = [
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      return {
        code: 20000000,
        data: {
          total: 10,
          items: [
            { id: 1, name: '冷雪瞳', age: 21 }
          ]
        }
      }
    }
  }
]
