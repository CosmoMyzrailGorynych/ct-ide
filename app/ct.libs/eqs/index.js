(() => {
    var validate = (val, name, type) => {
        if (val === void 0) {
            throw new Error(`[ct.eqs] The \`${name}\` property is required.`);
        } else if (type && typeof val !== type) {
            throw new Error(`[ct.eqs] The \`${name}\` property must be a type of \`${type}.\``);
        }
        return val;
    };
    class EQSQuery {
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
                    gridSize = validate(options.size, 'size', 'number');
                for (let ix = 0; ix < w; ix++) {
                    for (let iy = 0; iy < h; iy++) {
                        this.points.push({
                            x: x + (ix - w / 2) * gridSize,
                            y: y + (iy - h / 2) * gridSize,
                            score: 1
                        });
                    }
                }
            } else if (type === 'circle') {
                const r = validate(options.r, 'r', 'number'),
                      gridSize = validate(options.size, 'size', 'number'),
                      w = Math.floor(r*2 / gridSize);
                for (let ix = 0; ix < w; ix++) {
                    for (let iy = 0; iy < w; iy++) {
                        const xx = (ix - w / 2) * gridSize,
                              yy = (iy - w / 2) * gridSize;
                        if (Math.hypot(xx, yy) <= r) {
                            this.points.push({
                                x: x + xx,
                                y: y + yy,
                                score: 1
                            });
                        }
                    }
                }
            } else {
                throw new Error(`[ct.eqs] Unknown EQ type: \`${type}\``);
            }
            return this;
        }
        concat(eq) {
            return new EQSQuery(this.points.concat(eq.points));
        }
        score(func) {
            for (const point of this.points) {
                func(point);
            }
            return this;
        }
        sort() {
            this.points.sort((a, b) => b.score - a.score);
            return this;
        }
        normalize () {
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
        getFirst(n) {
            if (n === void 0) {
                return this.points[0];
            }
            return this.points.slice(0, n);
        }
        getPortion(rate) {
            return this.points.slice(0, Math.round(rate * this.points.length));
        }
        portion(rate) {
            this.points.length = Math.min(this.points.length, Math.max(1, Math.round(this.points.length * rate)));
            return this;
        }
        getRandom() {
            return this.points[Math.floor(Math.random() * this.points.length)];
        }
        getBetterRandom() {
            return this.points[Math.floor(Math.random()*Math.random() * this.points.length)];
        }
        draw() {
            for (const point of this.points) {
                ct.x.fillStyle = `rgb(${(1-point.score) * 255}, ${point.score * 255}, 0)`;
                ct.draw.circle(point.x, point.y, 2);
            }
        }
    }
    
    ct.eqs = {
        query(params) {
            return new EQSQuery(params);
        },
        scoreFree(ctype, multiplier) {
            multiplier = multiplier || 0;
            return function (point) {
                if (ct.place.free({shape: {type: 'point'}}, point.x, point.y, ctype)) {
                    point.score *= multiplier;
                }
            };
        },
        scoreOccupied(ctype, multiplier) {
            multiplier = multiplier || 0;
            return function (point) {
                if (ct.place.occupied({shape: {type: 'point'}}, point.x, point.y, ctype)) {
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
