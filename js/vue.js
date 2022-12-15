document.addEventListener('DOMContentLoaded', () => {
    // ローカルストレージ
    var STORAGE_KEY = 'todos-vuejs-demo'
    var todoStorage = {
        fetch: function () {
            var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
            todos.forEach(function (todo, index) {
                todo.id = index
            })
            todoStorage.uid = todos.length
            return todos
        },
        save: function (todos) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
        }
    }

    // インスタンス作成
    new Vue({
        // マウントするelement指定
        el: '#app',
        // 各データを宣言
        data: {
          // 作成されたToDoリストを格納する配列
          todos: [],
          current: -1,
          // 絞込み（stateの状態で管理）
          options: [
              { value: -1, label: 'すべて' },
              { value: 0, label: '作業中' },
              { value: 1, label: '完了' }
          ]
        },
        // 加工したデータを返す処理
        computed: {
            computedTodos: function () {
              // filterを利用してデータを加工
                return this.todos.filter(function (el) {
                    // 現在のstateが-1なら全て選択
                    // 現在のstateが0以上なら絞り込んで取得
                    return this.current < 0 ? true : this.current === el.state
                }, this)
            },
          labels() {
              return this.options.reduce(function (a, b) {
                  // キーから見つけやすいようにデータを加工
                  return Object.assign(a, { [b.value]: b.label })
              }, {})
          }
        },
        // ローカルストレージにデータを自動追加
        watch: {
            todos: {
                handler: function (todos) {
                  // ローカルストレージに保存
                  todoStorage.save(todos)
                },
                // deepでネストしているデータも監視
                deep: true
            }
        },
      // インスタンス作成が完了＆初期化が完了した時に、（vue.jsに常備のフック）
      created() {
          // インスタンス作成時に自動的に取得
          this.todos = todoStorage.fetch()
      },
      // 各メソッドを格納
      methods: {
        // 追加処理
        doAdd: function(event, value) {
            // 入力内容を取得
            var comment = this.$refs.comment
            // もし入力内容が空だったら、
            if (!comment.value.length) {
                // 何も処理をせずにreturn
                return
            }
            // todosにデータをpush
            this.todos.push({
                // idに+1した値をこのデータのidキーで格納
                id: todoStorage.uid++,
                // 入力内容をcommentキーで格納
                comment: comment.value,
                // 0をstateキーで格納（完了していないデータはstateを0とする）
                state: 0
            })
            // データ格納が終わった時にinputのvalueを空文字にする
            comment.value = ''
        },
        // stateを変更
        doChangeState: function (item) {
            // 現状と逆のstateに変更
            // 0 → 未完了
            // 1 → 完了済
            item.state = !item.state ? 1 : 0
        },
        // データの削除
        doRemove: function (item) {
            // クリックされた要素を特定
            var index = this.todos.indexOf(item)
            // クリックされた要素を削除
            this.todos.splice(index, 1)
        }
      }
    })
})