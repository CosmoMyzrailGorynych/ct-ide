docs-panel
    .flexrow
        aside.docs-panel-aNavigation
            virtual(each="{docCategory in docs}")
                h3(
                    onclick="{parent.showPage(docCategory.rootNode.path)}"
                    class="{active: docCategory.rootNode.path && currentPath === docCategory.rootNode.path, a: docCategory.rootNode.path}"
                )
                    span {docCategory.rootNode.name}
                ul(if="{docCategory.childNodes.length}")
                    li(
                        each="{node in docCategory.childNodes}"
                        onclick="{parent.parent.showPage(node.path, node.type)}"
                        class="{active: currentPath === node.path, a: node.path}"
                    )
                        span(if="{node.name}") {node.name}
                        span(if="{!node.name}") {voc[node.vocKey]}
        .docs-panel-Docs
            .docs-panel-DocsWidthLimiter
                raw(ref="raw" content="{docContent}")
    script.
        this.namespace = 'docsPanel';
        this.mixin(window.riotVoc);

        this.docs = [];
        this.docContent = '';

        this.refreshDocs = async () => {
            const modules = require('./data/node_requires/resources/modules');
            const catmods = (await modules.loadModules())
                .filter(module => module.name in global.currentProject.libs);
            const docOrders = catmods.map(modules.getModuleDocStructure);
            const unfilteredDocs = await Promise.all(docOrders);
            this.docs = [];
            for (const docGroup of unfilteredDocs) {
                if (docGroup.length) {
                    this.docs.push({
                        rootNode: docGroup[0],
                        childNodes: docGroup.slice(1)
                    });
                }
            }
            this.update();
        };

        window.signals.on('modulesChanged', this.refreshDocs);
        this.on('unmount', () => {
            window.signals.off('modulesChanged', this.refreshDocs);
        });
        this.refreshDocs();

        const md = require('markdown-it')({
            html: false,
            linkify: true,
            highlight: function highlight(str, lang) {
                const hljs = require('highlight.js');
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value;
                    } catch (oO) {
                        void 0;
                    }
                }
                return ''; // use external default escaping
            }
        });

        this.showPage = path => async () => {
            if (!path) {
                return;
            }
            const fs = require('fs-extra');
            this.currentPath = path;
            this.docContent = md.render(await fs.readFile(path, 'utf8'));
            this.update();
        };
