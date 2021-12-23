(() => {
    const validate = (val, name, type) => {
        if (val === void 0) {
            throw new Error(`[ct.eqs] The \`${name}\` property is required.`);
        } else if (type && typeof val !== type) {
            throw new Error(`[ct.eqs] The \`${name}\` property must be a type of \`${type}.\``);
        }
        return val;
    };
    class EQSQuery {
        // eslint-disable-next-line complexity
        constructor(options) {
            if (options instanceof EQSQuery) {
                this.points = [...options.points];
                return this;
            }
            if (Array.isArray(options)) {
                this.points = options;
                return this;
            }
            this.points = [];
            var x = validate(options.x, 'x', 'number'),
                y = validate(options.y, 'y', 'number');
            var type = options.type || 'grid';
            if (type === 'ring') {
                const n = validate(options.n, 'n', 'number'),
                      r = Math.floor(validate(options.r, 'r', 'number'));
                for (let i = 0; i < n; i++) {
                    this.points.push({
                        x: x + Math.sin(i / n * Math.PI * 2) * r,
                        y: y + Math.cos(i / n * Math.PI * 2) * r,
                        score: 1
                    });
                }
            } else if (type === 'grid') {
                const w = validate(options.w, 'w', 'number'),
                    h = validate(options.h, 'h', 'number'),
                    gridSizeX = validate(options.sizeX, 'sizeX', 'number'),
                    gridSizeY = validate(options.sizeY, 'sizeY', 'number');
                this.grid = [];
                for (let iy = 0; iy < h; iy++) {
                    const row = [];
                    this.grid.push(row);
                    for (let ix = 0; ix < w; ix++) {
                        const point = {
                            x: x + (ix - w / 2) * gridSizeX,
                            y: y + (iy - h / 2) * gridSizeY,
                            score: 1
                        };
                        if (options.triangle && iy % 2 === 1) {
                            point.x += gridSizeX / 2;
                        }
                        this.points.push(point);
                        row.push(point);
                    }
                }
            } else if (type === 'circle') {
                const r = validate(options.r, 'r', 'number'),
                      gridSizeX = validate(options.sizeX, 'sizeX', 'number'),
                      gridSizeY = validate(options.sizeY, 'sizeY', 'number'),
                      w = Math.floor(r*2 / gridSizeX),
                      h = Math.floor(r*2 / gridSizeY);
                for (let ix = 0; ix < w; ix++) {
                    for (let iy = 0; iy < h; iy++) {
                        let xx = (ix - w / 2) * gridSizeX;
                        const yy = (iy - h / 2) * gridSizeY;
                        if (options.triangle && iy % 2 === 1) {
                            xx += gridSizeX / 2;
                        }
                        if (Math.hypot(xx, yy) <= r) {
                            const point = {
                                x: x + xx,
                                y: y + yy,
                                score: 1
                            };
                            this.points.push(point);
                        }
                    }
                }
            } else if (type === 'copies') {
                if (!(validate(options, 'copyType', 'string') in ct.types.list)) {
                    throw new Error(`[ct.eqs] The '${options.copyType}' type does not exist.`);
                }
                for (const copy of ct.types.list[options.copyType]) {
                    if (options.limit && ct.u.pdc(copy.x, copy.y, options.x, options.y) > options.limit) {
                        continue;
                    }
                    this.points.push({
                        x: copy.x,
                        y: copy.y,
                        score: 1
                    });
                }
            } else {
                throw new Error(`[ct.eqs] Unknown EQ type: \`${type}\``);
            }
            return this;
        }
        /* Modifiers */
        score(func) {
            for (const point of this.points) {
                func(point);
            }
            return this;
        }
        scoreSpaced(func) {
            if (!('grid' in this)) {
                throw new Error('[ct.eqs] The scoreSpaced method may be only called on pure grids');
            }
            for (let iy = 0, ly = this.grid[iy].length; iy < ly; iy++) {
                for (let ix = 0, lx = this.grid.length; ix < lx; ix++) {
                   func(this.grid[iy][ix], this.grid, ix, iy);
                }
            }
        }
        sort() {
            this.points.sort((a, b) => b.score - a.score);
            return this;
        }
        normalize() {
            var max = this.points[0].score,
                min = this.points[0].score;
            var i = 1,
                l;
            for (l = this.points.length; i < l; i++) {
                max = Math.max(max, this.points[i].score);
                min = Math.min(min, this.points[i].score);
            }
            for (i = 0; i < l; i++) {
                this.points[i].score = (this.points[i].score - min) / (max - min);
            }
            return this;
        }
        invert() {
            for (const point of this.points) {
                point.score = 1 - point.score;
            }
            return this;
        }
        reverse() {
            this.points.reverse();
            return this;
        }
        portion(rate) {
            this.points.length = Math.min(this.points.length, Math.max(1, Math.round(this.points.length * rate)));
            delete this.grid;
            return this;
        }
        /* Utilities */
        /*draw() {
            for (const point of this.points) {
                ct.x.fillStyle = `rgb(${(1-point.score) * 255}, ${point.score * 255}, 0)`;
                ct.draw.circle(point.x, point.y, 2);
            }
        }*/
        concat(eq) {
            return new EQSQuery(this.points.concat(eq.points));
        }
        /* Getters */
        getFirst(n) {
            if (n === void 0) {
                return this.points[0];
            }
            return this.points.slice(0, n);
        }
        getLast(n) {
            if (n === void 0) {
                return this.points[this.points - 1];
            }
            return this.points.slice(-n);
        }
        getPortion(rate) {
            return this.points.slice(0, Math.round(rate * this.points.length));
        }
        getRandom() {
            return this.points[Math.floor(Math.random() * this.points.length)];
        }
        getBetterRandom() {
            return this.points[Math.floor(Math.random()*Math.random() * this.points.length)];
        }
    }

    ct.eqs = {
        query(params) {
            return new EQSQuery(params);
        },
        scoreFree(cgroup, multiplier) {
            multiplier = multiplier || 0;
            return function (point) {
                if (ct.place.free({shape: {type: 'point'}}, point.x, point.y, cgroup)) {
                    point.score *= multiplier;
                }
            };
        },
        scoreOccupied(cgroup, multiplier) {
            multiplier = multiplier || 0;
            return function (point) {
                if (ct.place.occupied({shape: {type: 'point'}}, point.x, point.y, cgroup)) {
                    point.score *= multiplier;
                }
            };
        },
        scoreTile(layer, multiplier) {
            multiplier = multiplier || 0;
            return function (point) {
                if (ct.place.tile({shape: {type: 'point'}}, point.x, point.y, layer)) {
                    point.score *= multiplier;
                }
            };
        },
        scoreDirection(direction, fromx, fromy, weight) {
            weight = weight || 1;
            return function (point) {
                point.score *= (1 - Math.abs(ct.u.deltaDir(direction, ct.u.pdn(fromx, fromy, point.x, point.y))) / 180)*weight
                                + point.score*(1-weight);
            };
        }
    };
})();
