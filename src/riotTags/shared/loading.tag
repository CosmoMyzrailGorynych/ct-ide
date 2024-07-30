//-
    Displays the inner content when the promise is not settled

    @attribute promise (Promise)
loading
    virtual(each="{output in dummyArray}")
        yield
    script.
        this.dummyArray = [];
        let trackedPromise;
        this.on('update', () => {
            if (this.opts.promise !== trackedPromise) {
                trackedPromise = this.opts.promise;
                let currentPromise = trackedPromise;
                trackedPromise.finally(() => {
                    if (trackedPromise === currentPromise) {
                        this.dummyArray = [];
                        this.update();
                    }
                });
            }
        });
        if (this.promise) {
            this.dummyArray = [1]
        }
