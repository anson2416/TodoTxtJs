/*******************************************************************************
* Copyright (C) 2013 Martin Gill
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
******************************************************************************/
/// <reference path="../defs/knockout.d.ts" />
var TodoTxtJs;
(function (TodoTxtJs) {
    var TodoManager = (function () {
        function TodoManager() {
            this._nextIndex = 0;
            this._data = ko.observableArray([]);
        }
        TodoManager.prototype.all = function () {
            return this._data().sort(this.sorter);
        };

        TodoManager.prototype.allProjects = function () {
            var hash = {};
            for (var i = 0; i < this._data().length; i++) {
                var projects = this._data()[i].projects();
                for (var j = 0; j < projects.length; j++) {
                    hash[projects[j]] = true;
                }
            }

            var result = [];
            for (var name in hash) {
                if (hash.hasOwnProperty(name)) {
                    result.push(name);
                }
            }

            return result;
        };

        TodoManager.prototype.allContexts = function () {
            var hash = {};
            for (var i = 0; i < this._data().length; i++) {
                var contexts = this._data()[i].contexts();
                for (var j = 0; j < contexts.length; j++) {
                    hash[contexts[j]] = true;
                }
            }

            var result = [];
            for (var name in hash) {
                if (hash.hasOwnProperty(name)) {
                    result.push(name);
                }
            }

            return result;
        };

        TodoManager.prototype.remove = function (index) {
            for (var i = 0; i < this._data().length; i++) {
                if (this._data()[i].index === index) {
                    this._data.splice(i, 1);
                    return;
                }
            }
        };

        TodoManager.prototype.removeAll = function () {
            this._data.removeAll();
            this._nextIndex = 0;
        };

        TodoManager.prototype.add = function (newTodo) {
            var todo;
            if (newTodo instanceof Todo) {
                todo = newTodo;
            } else if (typeof (newTodo) === "string") {
                todo = new Todo(newTodo);
            } else {
                throw "Invalid type for new TODO";
            }

            todo.index = this._nextIndex++;
            this._data.push(todo);
        };

        TodoManager.prototype.sorter = function (left, right) {
            if (left.completed() !== right.completed()) {
                if (left.completed() && !right.completed()) {
                    return 1;
                } else {
                    return -1;
                }
            }

            if (left.priorityScore() !== right.priorityScore()) {
                return left.priorityScore() < right.priorityScore() ? -1 : 1;
            }

            // Run out of significant values so use file order.
            return left.index < right.index ? -1 : 1;
        };

        TodoManager.prototype.loadFromStringArray = function (newData) {
            if (newData) {
                this.removeAll();
                for (var i = 0; i < newData.length; i++) {
                    var obj = newData[i];
                    this.add(obj);
                }
            }
        };

        TodoManager.prototype.exportToStringArray = function () {
            var sorted = ko.observableArray(this._data());
            sorted.sort(function (left, right) {
                return left.index - right.index;
            });

            var result = [];
            for (var i = 0; i < sorted().length; i++) {
                result.push(sorted()[i].text());
            }

            return result;
        };
        return TodoManager;
    })();
    TodoTxtJs.TodoManager = TodoManager;
})(TodoTxtJs || (TodoTxtJs = {}));
//@ sourceMappingURL=todomanager.js.map