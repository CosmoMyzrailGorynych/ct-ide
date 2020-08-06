modules-settings.panel.view
    collapsible-section.aModuleFilter(heading="{voc.filter}" defaultstate="closed" storestatekey="modulesFilter")
        .flexrow
            label.nogrow
                b {parent.vocGlob.search}
                br
                .aSearchWrap.nm
                    input.inline(type="text" value="{parent.searchValue}" onkeyup="{parent.searchMod}")
                    svg.feather
                        use(xlink:href="data/icons.svg#search")
            .aModuleFilterColumns
                // The "if" clause in the label hides categories with 0 items
                label.checkbox(
                    each="{category in parent.filterCategories}"
                    if="{parent.categoriesCounter[category]}"
                )
                    input(
                        type="checkbox"
                        checked="{parent.parent.pickedCategories.indexOf(category) !== -1}"
                        onchange="{parent.parent.toggleCategory(category)}"
                    )
                    svg.feather.accent1
                        use(xlink:href="data/icons.svg#{parent.parent.categoryToIconMap[category]}")
                    span   {parent.parent.voc.categories[category]} ({parent.parent.categoriesCounter[category]})
    collapsible-section(preservedom="yes" hlevel="1" heading="{voc.enabledModules}" defaultstate="opened" storestatekey="modulesEnabled")
        .aModuleList
            .aModuleCard(
                each="{module in parent.enabledModules}"
                if="{parent.checkVisibility(module)}"
                onclick="{parent.parent.openModule(module)}"
            )
                module-meta(module="{module}")
    collapsible-section(preservedom="yes" hlevel="1" heading="{voc.availableModules}" defaultstate="opened" storestatekey="modulesAvailable")
        .aModuleList
            .aModuleCard(
                each="{module in parent.allModules}"
                if="{parent.checkVisibility(module)}"
                onclick="{parent.parent.openModule(module)}"
            )
                module-meta(module="{module}")
    label.file.flexfix-footer.nmb
        input(
            type="file"
            ref="importmodules"
            accept=".zip"
            onchange="{importModules}"
        )
        .button.wide.inline.nml.nmr
            svg.feather
                use(xlink:href="data/icons.svg#folder")
            span {voc.importModules}
    module-viewer(if="{openedModule}" module="{openedModule}" onclose="{closeModule}")
    script.
        this.namespace = 'modules';
        this.mixin(window.riotVoc);

        const {moduleDir, loadModules, categoryToIconMap} = require('./data/node_requires/resources/modules');

        this.categoriesCounter = {};
        this.filterCategories = Object.keys(categoryToIconMap).sort();
        this.filterCategories.splice(this.filterCategories.indexOf('default'), 1);
        this.categoryToIconMap = categoryToIconMap;

        const path = require('path'),
              fs = require('fs-extra'),
              unzipper = require('unzipper');

        this.resortEnabledModules = () => {
            this.enabledModules = this.allModules
                .filter(module => module.name in global.currentProject.libs);
        };
        loadModules().then(modules => {
            // Sort by their codename (folder name)
            this.allModules = modules.sort((a, b) => a.name.localeCompare(b.name));
            this.categoriesCounter = {};
            for (const category of this.filterCategories) {
                this.categoriesCounter[category] = 0;
            }
            for (const module of this.allModules) {
                if (module.manifest.main.categories) {
                    for (const category of module.manifest.main.categories) {
                        if (this.filterCategories.includes(category)) {
                            this.categoriesCounter[category]++;
                        }
                    }
                }
            }
            this.resortEnabledModules();
            this.update();
        });


        this.importModules = e => {
            const {files} = e.target;
            if (files.length === 0) {
                return;
            }
            const value = files[0].path;
            e.target.value = '';
            let parentName = null;
            let moduleName = null;
            const entries = [];
            fs.createReadStream(value)
            .pipe(unzipper.Parse())
            .on('entry', async entry => {
                const fileName = entry.path.toLowerCase();
                if (path.basename(fileName) === 'module.json') {
                    // consume the entry by buffering the contents into memory.
                    // eslint-disable-next-line require-atomic-updates
                    const content = entry.tmpContent = await entry.buffer();
                    const json = JSON.parse(content.toString());
                    moduleName = json.main.packageName || path.basename(value, '.zip');
                    const indexOf = fileName.indexOf('/');
                    if (indexOf !== -1) {
                        parentName = fileName.substring(0, indexOf);
                    }
                }
                entries.push(entry);
            })
            .on('finish', async () => {
                if (moduleName !== null) {
                    // create a parent directory
                    await fs.ensureDir(path.join(moduleDir, moduleName));
                    for (const entry of entries) {
                        const filePath = entry.path;
                        const indexOf = filePath.indexOf('/');
                        if (filePath === parentName) {
                            continue;
                        }
                        if (indexOf !== -1) {
                            if (parentName !== null) {
                                entry.path = `${moduleName}${filePath.substring(indexOf)}`;
                            } else {
                                entry.path = `${moduleName}/${filePath}`;
                            }
                        } else {
                            entry.path = `${moduleName}/${filePath}`;
                        }
                        entry.path = path.join(moduleDir, entry.path);
                         // 'Directory' or 'File'
                        if (entry.type === 'Directory') {
                            // eslint-disable-next-line no-await-in-loop
                            await fs.ensureDir(entry.path);
                        } else {
                            const fileName = entry.path.toLowerCase();
                            if (fileName.endsWith('module.json')) {
                                const content = entry.tmpContent;
                                // eslint-disable-next-line no-await-in-loop
                                await fs.writeFile(entry.path, content);
                            } else {
                                entry.pipe(fs.createWriteStream(entry.path))
                                .on('error', (e) => {
                                    alertify.error(e);
                                    console.error(e);
                                });
                            }
                        }
                    }
                    this.allModules.push(moduleName);
                    this.update();
                }
            });
        };

        this.searchValue = '';
        this.searchMod = e => {
            this.searchValue = e.target.value.trim();
            this.update();
        };
        this.pickedCategories = [];
        this.toggleCategory = category => () => {
            const ind = this.pickedCategories.indexOf(category);
            if (ind !== -1) {
                this.pickedCategories.splice(ind, 1);
            } else {
                this.pickedCategories.push(category);
            }
            this.update();
        };
        this.checkVisibility = module => {
            const visibleDueToSearch = !this.searchValue ||
                  module.name.indexOf(this.searchValue) !== -1 ||
                  module.manifest.main.tagline.indexOf(this.searchValue) !== -1;
            const visibleDueToFilters = this.pickedCategories.length === 0 ||
                  module.manifest.main.categories.find(c => this.pickedCategories.indexOf(c) !== -1);
            return visibleDueToFilters && visibleDueToSearch;
        };

        this.openModule = module => () => {
            this.openedModule = module;
            this.update();
        };
        this.closeModule = () => {
            this.openedModule = null;
            this.update();
        };
