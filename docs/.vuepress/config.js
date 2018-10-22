module.exports = {
    title: 'ct.js Documentation',
    description: 'Docs, tutorials, guides',
    dest: './app/docs',
    
    themeConfig: {
        nav: [{
            text: 'Home',
            link: '/'
        }, {
            text: "Official website",
            link: "https://ctjs.rocks"
        }, {
            text: 'Discord',
            link: 'https://discord.gg/CggbPkb'
        }, {
            text: 'Forum',
            link: 'https://comigo.itch.io/ct/community'
        }],
        sidebar: [
            [
                '/', 'Home'
            ], {
                title: 'Introduction to JS',
                collapsable: false,
                children: [
                    'jsintro_pt1',
                    'jsintro_pt2'
                ],
            }, {
                collapsable: false,
                title: "Tutorials",
                children: [
                    'tut-making-shooter',
                    'tut-making-platformer',
                    'localstorage'
                ],
            }, {
                title: 'The `core` library',
                collapsable: false,
                children: [
                    'ct',
                    'ct.draw',
                    'ct.mouse',
                    'ct.res',
                    'ct.rooms',
                    'ct.sound',
                    'ct.styles',
                    'ct.types',
                    ['ct.u', 'ct.u (utilities)'],
                    ['catmoddocs.md', 'Where are the other ct.* docs?']
                ]
            }, {
                title: 'Extending ct.js',
                collapsable: false,
                children: [
                    ['making-mods', 'Making your own mods']
                ]
            }
        ],
        lastUpdated: 'Last Updated'
    }
};  