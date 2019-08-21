/**
 * Based on Dracula theme
 */
/* global ace */

ace.define('ace/theme/horizon',['require','exports','module','ace/lib/dom'], function(require, exports, module) {

    exports.isDark = true;
    exports.cssClass = 'ace-horizon';
    exports.cssText = `
.ace-horizon .ace_gutter {
    background: #1C1E26;
    color: #2E3037
}
.ace-horizon .ace_print-margin {
    width: 1px;
    background: #44475a
}
.ace-horizon {
    background-color: #1C1E26;
    color: #D5D8DA
}
.ace-horizon .ace_cursor {
    color: #E95678
}
.ace-horizon .ace_marker-layer .ace_selection {
    background: #44475a
}
.ace-horizon.ace_multiselect .ace_selection.ace_start {
    box-shadow: 0 0 3px 0px #1C1E26;
    border-radius: 2px
}
.ace-horizon .ace_marker-layer .ace_step {
    background: rgb(198, 219, 174)
}
.ace-horizon .ace_marker-layer .ace_bracket {
    margin: -1px 0 0 -1px;
    border: 1px solid #FAC29A
}
.ace-horizon .ace_marker-layer .ace_active-line {
    background: #22232D
}
.ace-horizon .ace_gutter-active-line {
    background-color: #22232D
}
.ace-horizon .ace_marker-layer .ace_selected-word {
    box-shadow: 0px 0px 0px 1px #FAC29A;
    border-radius: 3px;
}
.ace-horizon .ace_fold {
    background-color: #FAC29A;
    border-color: #D5D8DA
}
.ace-horizon .ace_keyword {
    color: #B877DB;
    font-weight: bold;
}
.ace-horizon .ace_operator {
    color: #D5D8DA;
    font-weight: bold;
}
.ace-horizon .ace_constant.ace_language {
    color: #bd93f9
}
.ace-horizon .ace_constant.ace_numeric {
    color: #F09483
}
.ace-horizon .ace_constant.ace_character {
    color: #F09483
}
.ace-horizon .ace_constant.ace_character.ace_escape {
    color: #B877DB
}
.ace-horizon .ace_constant.ace_other {
    color: #bd93f9
    }
.ace-horizon .ace_support.ace_function {
    color: #25B0BC
}
.ace-horizon .ace_support.ace_constant {
    color: #6be5fd
}
.ace-horizon .ace_support.ace_class {
    font-style: italic;
    color: #66d9ef
}
.ace-horizon .ace_support.ace_type {
    font-style: italic;
    color: #66d9ef
}
.ace-horizon .ace_storage {
    color: #B877DB
}
.ace-horizon .ace_storage.ace_type {
    color: #B877DB
}
.ace-horizon .ace_invalid {
    color: #4B4B52;
    background-color: #B877DB
}
.ace-horizon .ace_invalid.ace_deprecated {
    color: #4B4B52;
    background-color: #bd93f9
}
.ace-horizon .ace_string {
    color: #FAC29A
}
.ace-horizon .ace_comment {
    color: #4B4B52;
    font-style: italic;
}
.ace-horizon .ace_variable {
    color: #FAC29A
}
.ace-horizon .ace_identifier {
    color: #E95678;
}
.ace-horizon .ace_variable.ace_parameter {
    font-style: italic;
    color: #ffb86c
}
.ace-horizon .ace_entity.ace_other.ace_attribute-name {
    color: #FAC29A
}
.ace-horizon .ace_entity.ace_name.ace_function {
    color: #FAC29A
}
.ace-horizon .ace_entity.ace_name.ace_tag {
    color: #B877DB
}
.ace-horizon .ace_invisible {
    color: #626680;
}
.ace-horizon .ace_indent-guide {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHB3d/8PAAOIAdULw8qMAAAAAElFTkSuQmCC) right repeat-y
}
`;
    exports.$selectionColorConflict = true;

    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
    });                (function() {
                        ace.require(["ace/theme/horizon"], function(m) {
                            if (typeof module == "object" && typeof exports == "object" && module) {
                                module.exports = m;
                            }
                        });
                    })();
