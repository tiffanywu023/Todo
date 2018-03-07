// 辅助线函数
var ckXian = function() {
    var body  = document.querySelector('body')
    var style ='<style id="xm" media="screen"> * {outline: 1px red dashed!important} </style>'
    var i = false
    body.addEventListener('keydown', function(event) {
        if (event.keyCode === 77 && event.ctrlKey) {
            if (i) {
                var styletog = document.querySelector('#xm')
                styletog.remove()
                i = false
            } else {
                body.insertAdjacentHTML('afterbegin', style)
                i = true
            }
        }
    })
}() // 加载代码 使用 Ctrl + M 显示参考线
//换肤部分
var changeSkin = function() {
    bindAll('.skin', 'click', function(event) {
        var css = event.target.dataset.css
        var link = e('.background')
        if(link != null) {
            link.href = `css/` + css
        }
    })
}

//todo
//定义初始变量
var todos = []

//切换按钮
var toggleButton = function(element1, element2, className) {
    toggleClass(element1, className)
    toggleClass(element2, className)
}

var templateTodo = (todo) => {
    /*
     {
     "created_time": 1478096811,
     "id": 698,
     "qq": "798144469",
     "task": "study"
     }
     */
    var task = todo.task
    var id = todo.id
    var t = `
        <div class='todo-cell'>
          <img class="todoBox unchecked show" id="id-img-unChecked" src="img/unCheck.png" alt="空格" data-id="${id}"> 
          <img class="todoBox checked" id="id-img-checked" src="img/Checked.png" alt="已勾选空格" data-id="${id}">
          <span class='list' data-id="${id}">${task}</span>
          <img class="delete hidden" src="img/delete.png" alt="删除" data-id="${id}">
        </div>
    `
    return t
}

//将目前的todo添加到页面中
var insertTodo = function(todo) {
    var todoContainer = e('.todoListContent')
    var t = templateTodo(todo)
    appendHtml(todoContainer, t)
}

//api部分
var ajax = function(method, path, data, reseponseCallback) {
    var r = new XMLHttpRequest()
    // 设置请求方法和请求地址
    r.open(method, path, true)
    // 设置发送的数据的格式
    r.setRequestHeader('Content-Type', 'application/json')
    // 注册响应函数
    r.onreadystatechange = function() {
        if(r.readyState === 4) {
            reseponseCallback(r)
        }
    }
    // 发送请求
    r.send(data)
}

// 载入页面的时候  把已经有的 todo 加载到页面中
var loadTodos = function() {
    var baseUrl = '/api/todo'
    var method = 'GET'
    var path = '/all'
    var url = baseUrl + path
    ajax(method, url, '', function(r){
        var todos = JSON.parse(r.response)
        // log('反序列化之后', todos)
        for (var i = 0; i < todos.length; i++) {
            var t = todos[i]
            insertTodo(t)
        }
    })
}

var apiTodoAdd = function(task, callback) {
    var method = 'POST'
    var url = '/api/todo/add'
    var data1 = {
        'task': task,
    }
    var data = JSON.stringify(data1)
    ajax(method, url, data, function(r){
        var t = JSON.parse(r.response)
        console.log(t)
        insertTodo(data1)
    })
}

var apiTodoDelete = function(selfdata, callback) {
    var method = 'GET'
    var baseUrl = '/api/todo/delete/'
    var url = baseUrl + selfdata
    var data = ''
    // 发送 ajax 请求来删除 todo
    ajax(method, url, data, function(r){
        log('delete', r.response)
        var t = JSON.parse(r.response)
        callback(t)
    })
}


//添加todo
var addTodo = function() {
    var addButton = e('.add')
    bindEvent(addButton, 'click', function() {
        // 获得 input.value
        var todoInput = e('.input')
        var todo = todoInput.value
        // 添加到 todoContent 中
        apiTodoAdd(todo)
        todoInput.value = ''
    })
}

//删除todo
var deleteTodo = function() {
    bindAll('.todoListContent', 'click', function(event) {
        log('点击了删除按钮')
        var target = event.target
        log('deleteTodo target是什么', target)
        var todoListContent = e('.todoListContent')
        var deleteDiv = target.parentElement
        log('deleteDiv是什么', deleteDiv)
        log('类包含了什么', target.classList, typeof(target.classList))
        if(target.classList.contains('delete')){
            log('包含了delete')
            var index = -1
            for (var i = 0; i < todoListContent.children.length; i++) {
                 var cell = todoListContent.children[i]
                 if(deleteDiv == cell) {
                     index = i
                     log('找到下标', i)
                     break
                 }
             }
             var data = target.dataset.id
             apiTodoDelete(data, function(){
                 deleteDiv.remove()
             })
        }
    })
}


//鼠标移到todo上时删除标志显示，移出去则隐藏
var deleteButtonShow = function() {
    bindAll('.todoListContent', 'mouseover', function() {
        // log('鼠标移到todo-cell上面了')
        var target = event.target
        // log('target是什么', target)
        var deleteButton = target.querySelector('.delete')
        // log('deleteButton是什么', deleteButton)
        if(target.classList.contains('todo-cell')){
            deleteButton.classList.remove('hidden')
        }
    })
    bindAll('.todoListContent', 'mouseout', function() {
        // log('鼠标移出去了')
        var target = event.target
        var deleteButton = target.querySelector('.delete')
        if(target.classList.contains('todo-cell')){
            deleteButton.classList.add('hidden')
        }
    })
}

//勾选空格以及加划线功能
var okTodo = function() {
    bindAll('.todoListContent', 'click', function(event) {
        var target = event.target
        // log('target是什么', target)
        var parent = target.parentElement
        //切换空格状态
        var unchecked = parent.querySelector('.unchecked')
        var checked = parent.querySelector('.checked')
        if(target.classList.contains('todoBox')){
            toggleButton(unchecked, checked, 'show')
        }
        //切换划线状态
        var list = parent.querySelector('.list')
        if(target.classList.contains('todoBox')){
            toggleClass(list, 'done')
        }
    })
}

var _main = function() {
    changeSkin()
    loadTodos()
    addTodo()
    deleteTodo()
    okTodo()
    deleteButtonShow()
}

_main()


