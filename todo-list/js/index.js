var title = document.getElementsByClassName('title')[0],
    todoList = document.getElementsByClassName('todo-list')[0],
    // 判断是编辑状态，添加状态，初始状态是添加状态
    editFlag = false,
    todoItems,
    currentSpan,
    context,
    submitBtn,
    editIndex;

// 点击todo-item的编辑按钮、删除按钮的事件
addEvent(todoList, 'click', function(e) {
    e = e || window.event;
    var tar = e.target || window.srcElement,
        currentLi = tar.parentNode;

    // 点击删除按钮，删除本条todo-item
    if (tar.className === 'delete') {
        currentLi.remove();
    }
    // 点击编辑按钮，输入栏title改变状态
    else if (tar.className === 'edit') {
        // 可编辑状态需要增加取消按钮，可取消编辑状态（事件在title中绑定）
        if (!editFlag) {
            newBtn = document.createElement('button');
            newBtn.className = 'cancel';
            newBtn.innerText = '取消';
            title.appendChild(newBtn);
        }

        // 编辑输入框中写入需要编辑的内容，按钮名称从添加修改到编辑
        context = title.getElementsByClassName('context')[0];
        submitBtn = title.getElementsByClassName('submit')[0];
        currentSpan = currentLi.getElementsByClassName('detail')[0];
        todoItems = todoList.getElementsByClassName('todo-item');
        context.value = currentSpan.innerText;
        submitBtn.innerText = '编辑';
        // 保存编辑todo-item的索引，方便点击修改按钮时（事件在title中绑定），找到修改了哪个todo-item
        editIndex = Array.prototype.indexOf.call(todoItems, currentLi);

        // 设置当前是可编辑状态
        editFlag = true;
    }
});

// 点击添加/编辑、取消按钮
addEvent(title, 'click', function(e) {
    e = e || window.event;
    var tar = e.target || window.srcElement;

    // 当前状态是添加状态时，增加一条todo-item
    if (!editFlag) {
        context = title.getElementsByClassName('context')[0];
        // 输入框内有值，才添加；为空不添加
        if (context.value && tar.className === 'submit') {
            var oLi = document.createElement('li'),
                oSpan = document.createElement('span'),
                oAEdit = document.createElement('a'),
                oADelete = document.createElement('a');

            oSpan.innerText = context.value;
            oSpan.className = 'detail';
            oAEdit.innerText = '编辑';
            oAEdit.className = 'edit';
            oAEdit.href = 'javascript:;';
            oADelete.innerText = '删除';
            oADelete.className = 'delete';
            oADelete.href = 'javascript:;';
            oLi.className = 'todo-item';
            oLi.appendChild(oSpan);
            oLi.appendChild(oAEdit);
            oLi.appendChild(oADelete);
            todoList.appendChild(oLi);
            context.value = '';
        }
    }
    // 当前状态是编辑状态时，编辑、取消操作
    else {
        // 点击编辑按钮修改原todo-item的内容值。
        if (tar.className === 'submit' && context.value !== '') {
            currentLi = todoItems[editIndex];
            currentSpan = currentLi.getElementsByClassName('detail')[0];
            currentSpan.innerText = context.value;
            submitBtn.innerText = '添加';
            context.value = '';
            editFlag = false;
            cancel();
        }
        // 点击取消按钮，重置输入栏title状态为添加
        else if (tar.className === 'cancel') {
            cancel();
        }
    }

    function cancel() {
        submitBtn.innerText = '添加';
        context.value = '';
        var cancelBtn = title.getElementsByClassName('cancel')[0];
        cancelBtn.remove();
        editFlag = false;
    }
});

// 事件绑定兼容函数
function addEvent(el, type, fn) {
    if (el.addEventListener) {
        el.addEventListener(type, fn);
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, function() {
            fn.call(el);
        });
    } else {
        el['on' + type] = function() {
            fn();
        };
    }
}