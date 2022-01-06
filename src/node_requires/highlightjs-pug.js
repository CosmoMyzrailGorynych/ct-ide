const highlightPug = function highlightPug(hljs) {
    var TAG_SELECTORS = 'abbr|acronym|address|area|article|aside|audio|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|frame|frameset|(h[1-6])|head|header|hgroup|hr|html|i|iframe|img|ins|kbd|keygen|label|legend|li|link|map|mark|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|samp|script|section|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video|a|input';
    return {
        // eslint-disable-next-line camelcase
        case_insensitive: false,
        aliases: ['jade'],
        contains: [
            // string
            {
                className: 'string',
                begin: '`',
                end: '`',
                illegal: '\\n',
                contains: [hljs.BACKSLASH_ESCAPE]
            },
            {
                className: 'string',
                begin: '"',
                end: '"',
                illegal: '\\n',
                contains: [hljs.BACKSLASH_ESCAPE]
            },
            {
                className: 'string',
                begin: '\'',
                end: '\'',
                illegal: '\\n',
                contains: [hljs.BACKSLASH_ESCAPE]
            },
            // doctype
            {
                className: 'comment',
                begin: 'doctype.*',
                relevance: 0
            },
            // variable
            {
                className: 'variable',
                relevance: 0,
                variants: [{
                    begin: '\\#{', end: '\\}', excludeBegin: true, excludeEnd: true
                }, {
                    begin: '\\${', end: '\\}', excludeBegin: true, excludeEnd: true
                }]
            },
            // comment
            {
                className: 'comment',
                begin: /\/\/-?.*/
            },
            // tag
            {
                className: 'selector-tag',
                begin: '^[ \t]*\\b(' + TAG_SELECTORS + ')\\b'
            },
            // id
            {
                className: 'selector-id', begin: /#[A-Za-z0-9_-]+/
            },
            // class
            {
                className: 'type', begin: /\.[A-Za-z0-9_-]+/
            },
            // attributes
            {
                className: 'attribute',
                begin: '&attributes',
                relevance: 0
            },
            // symbol
            {
                className: 'symbol',
                begin: /[=,:?!]|\.($|\n)/
            }
        ]
    };
};
module.exports = function register(hljs) {
    hljs.registerLanguage('pug', highlightPug);
};
