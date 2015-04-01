/**
 * MathEditor
 *
 * Adds editing tools for AsciiMath equations
 *
 * @version 0.1a
 * @author Ville Korhonen <ville.korhonen@ylioppilastutkinto.fi>
 */


var MathEditor = {
    _data: {
        element: null,
        toolbar: [],
    },
    settings: {},
    addButton: function(action, title, icon, order) {
        var button = {
            action: action,
            icon: icon,
            order: order,
            title: title
        };
        this._data.toolbar.push(button);
        var btn = document.createElement('input');
        btn.type = 'button';
        btn.className = 'matheditor-action';
        btn.onclickaction = action;
        btn.matheditor = this._data.element.matheditor;

        btn.value = title;
        btn.innerHTML = '<i class="todo"></i> ' + title;

        if (typeof btn.addEventListener != 'undefined') {
            btn.addEventListener('click', function(e) {
                if (typeof e.srcElement.onclickaction != 'undefined') {
                    e.srcElement.onclickaction();
                } else {
                    console.log('No action specified');
                }
                return false;
            }, false);
        } else if (typeof btn.attachEvent != 'undefined') {
            btn.attachEvent('click', function(e) {
                if (typeof e.srcElement.onclickaction != 'undefined') {
                    e.srcElement.onclickaction();
                } else {
                    console.log('No action specified');
                }
                return false;
            });
        }

        this._data.toolbarElement.appendChild(btn);
    },
    removeButton: function(i) {
        this._data.toolbar.splice(i, 1);
    },
    guid: function() {
        function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);}
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +s4() + '-' + s4() + s4() + s4();
    },
    getToolbar: function() {
        return this.toolbarElement;
    },
    insertSelection: function (e, myValueBefore, myValueAfter) {
        var myField = document.getElementById(e);
        if (document.selection) {
            myField.focus();
            document.selection.createRange().text = myValueBefore + document.selection.createRange().text + myValueAfter;
        } else if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;
            myField.value = myField.value.substring(0, startPos)+ myValueBefore+ myField.value.substring(startPos, endPos)+ myValueAfter+ myField.value.substring(endPos, myField.value.length);
            redraw();
        } 
    },
    enable: function(e) {
        var element = document.getElementById(e);
        if (typeof(element) == 'undefined') {return;}
        console.log('Enable MathEditor for element "' + element.id + '".');
        element.matheditor = this._clone(this);

        if (typeof(MathJax) == 'undefined') {
            var script = document.createElement('script');
            script.src = 'MathJax/MathJax.js?config=AM_HTMLorMML';
            var body = document.getElementsByTagName('body')[0];
            body.appendChild(script);
        }

        element.matheditor._data.editor = element;

        var currentOrder = 0;
        var childs = element.parentNode.childNodes;

        for (var i=0; i<childs.length; i++) {
            if (childs[i] == element) {
                currentOrder = i;
                break;
            }
        }

        var parent = element.parentNode;

        var editorParent = document.createElement('div');
        element.matheditor._data.parent = editorParent;

        var epid = 'matheditor-' + this.guid();
        editorParent.id = epid;
        editorParent.className = 'matheditor';
        console.log('EditorParent #' + epid + '.');

        parent.insertBefore(editorParent, childs[currentOrder]);
        
        var toolbar = document.createElement('div');
        toolbar.className = 'matheditor-toolbar';
        element.matheditor._data.toolbarElement = toolbar;
        editorParent.appendChild(toolbar);

        editorParent.appendChild(element);
        editorParent.style.border = '2px solid green';

        var preview = document.createElement('div');
        preview.className = 'matheditor-preview';
        element.matheditor._data.previewElement = preview;
        editorParent.appendChild(preview);

        // TODO: Attach only to specific keys (space, enter, ?)
        if (typeof element.addEventListener != 'undefined') {
            element.addEventListener('keyup', function(e) {
                //console.log('keyup: ' + e.keyCode); 
                e.srcElement.matheditor.redraw();
            }, false);
        } else if (typeof element.attachEvent != 'undefined') {
            element.attachEvent('onkeyup', function(e) {
                //console.log('keyup: ' + e.keyCode);
                e.srcElement.matheditor.redraw();
            });
        }
        element.matheditor.addToolbar();
    },
    addToolbar: function() {
        /*this.addButton(function() {}, 'testi', 'x', 0);
        this.addButton(function() {}, 'testi', 'x', 0);
        this.addButton(function() {}, 'testi', 'x', 0);
        this.addButton(function() {}, 'testi', 'x', 0);
        this.addButton(function() {}, 'testi', 'x', 0);
        this.addButton(function() {}, 'testi', 'x', 0);
*/
    },
    redraw: function() {
        //this._data.previewElement.textContent = this._data.editor.value;
        this._data.previewElement.innerHTML = this._data.editor.value.replace(/\r?\n/g, '<br />');
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this._data.previewElement]);
    },
    _clone: function(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }
};
