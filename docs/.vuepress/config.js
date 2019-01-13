module.exports = {
    title: 'ct.js Documentation',
    description: 'Docs, tutorials, guides',
    dest: './app/data/docs',
    
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
                title: 'Working with assets',
                collapsable: false,
                children: [
                    ['skeletal-animation.md', 'Using skeletal animation']
                ]
            }, {
                title: 'Extending ct.js',
                collapsable: false,
                children: [
                    ['making-mods', 'Making your own mods']
                ]
            }, {
                title: 'Troubleshooting',
                collapsable: false,
                children: [
                    ['migration-0to1', 'Migration from 0.x to 1.x'],
                    ['troubleshooting-teared-background', 'Background splits into squares!']
                ]
            }
        ],
        lastUpdated: 'Last Updated'
    }
};  