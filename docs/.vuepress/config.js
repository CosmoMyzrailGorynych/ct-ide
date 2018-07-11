module.exports = {
    title: 'ct.js Documentation',
    description: 'Docs, tutorials, guides',

    base: '/',
    dest: './app/docs',
    
    themeConfig: {
        nav: [{
            text: 'Home',
            link: '/'
        }, {
            text: "Official website",
            link: "https://ctjs.rocks"
        }, {
            text: 'Discord Server',
            link: 'https://discord.gg/rC2AnYw'
        }],
        sidebar: [
            [
                '/', 'Home'
            ], {
                title: 'Introduction to JS',
                collapsable: false,
                children: [
                    'jsIntro_pt1',
                    'jsIntro_pt2'
                ],
            }, {
                collapsable: false,
                title: "Tutorials",
                children: [
                    'tutMakingShooter'
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
                    ['ct.u', 'ct.u (utilities)']
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