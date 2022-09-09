//
    @slot
    @attribute target
error-notice.anErrorNotice
    <yield/>
    script.
        const reposition = () => {
            let {target} = this.opts;
            if (target.root) {
                target = target.root;
            }
            const box = target.getBoundingClientRect();
            this.root.style.top = (box.top + box.height) + 'px';
            this.root.style.left = (box.left + box.width / 2) + 'px';
        };
        this.on('update', reposition);
        this.on('mount', reposition);
        const interval = setInterval(reposition, 150);
        this.on('unmount', () => {
            clearInterval(interval);
        });
