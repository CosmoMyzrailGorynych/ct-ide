//-
    Displays the inner content when the promise is resolved

    @attribute promise (Promise)
        The promise that will be tracked
    @attribute [key] (any)
        If set, the tag will update its tracked promise only when this key changes.
        This is required if the promise gets generated dynamically in parent's markup.
await
    span(style="display: contents;" if="{state === 'resolved'}")
        yield(from="resolved")
    span(style="display: contents;" if="{state === 'error'}")
        yield(from="error")
    span(style="display: contents;" if="{state === 'pending'}")
        yield(from="pending")
    span(style="display: contents;" if="{state === 'error' || state === 'resolved'}")
        yield(from="finally")
    script.
        this.state = 'pending';
        let trackedPromise, key;
        const track = () => {
            if (this.opts.key) {
                key = this.opts.key;
            }
            trackedPromise = this.opts.promise;
            this.opts.promise.then(value => {
                // Cancel stale promises
                if (this.opts.key) {
                    if (this.opts.key !== key) {
                        return;
                    }
                } else if (key) {
                    // If has no key but it was present, cancel
                    return;
                } else if (trackedPromise !== this.opts.promise) {
                    return;
                }
                this.update({
                    value,
                    state: 'resolved'
                });
            })
            .catch(error => {
                if (this.opts.promise !== trackedPromise) {
                    return;
                }
                this.update({
                    error,
                    state: 'error'
                })
            });
        };
        this.on('mount', () => {
            track();
        });
        this.on('update', () => {
            if (this.opts.key) {
                if (this.opts.key !== key) {
                    track();
                }
            } else if (trackedPromise !== this.opts.promise) {
                track();
            }
        });
