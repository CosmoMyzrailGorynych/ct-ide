if (this.ctype) {
    ct.place.ctypeCollections[this.$ctype].splice(ct.place.ctypeCollections[this.$ctype].indexOf(this), 1);
}
if (this.$chashes) {
    for (const hash of this.$chashes) {
        ct.place.grid[hash].splice(ct.place.grid[hash].indexOf(this), 1);
    }
}
