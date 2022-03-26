if (this.$chashes) {
    for (const hash of this.$chashes) {
        ct.place.grid[hash].splice(ct.place.grid[hash].indexOf(this), 1);
    }
}
