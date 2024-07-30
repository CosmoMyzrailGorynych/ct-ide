/* Based on https://pixijs.io/pixi-filters/docs/PIXI.filters */
/* Sandbox demo: https://pixijs.io/pixi-filters/tools/demo/ */

(() => {
  const filters = [
    'Adjustment',
    'AdvancedBloom',
    'Ascii',
    'Bevel',
    'Bloom',
    'BulgePinch',
    'ColorMap',
    'ColorOverlay',
    'ColorReplace',
    'Convolution',
    'CrossHatch',
    'CRT',
    'Dot',
    'DropShadow',
    'Emboss',
    'Glitch',
    'Glow',
    'Godray',
    'KawaseBlur',
    'MotionBlur',
    'MultiColorReplace',
    'OldFilm',
    'Outline',
    'Pixelate',
    'RadialBlur',
    'Reflection',
    'RGBSplit',
    'Shockwave',
    'SimpleLightmap',
    'TiltShift',
    'Twist',
    'ZoomBlur',
    //Built-in filters
    'Alpha',
    'Blur',
    'BlurPass',
    'ColorMatrix',
    'Displacement',
    'FXAA',
    'Noise'
  ];

  const addFilter = (target, fx) => {
    if (!target.filters) {
      target.filters = [fx];
    } else {
      target.filters.push(fx);
    }
    return fx;
  };

  const createFilter = (target, filter, ...args) => {
    let fx;
    let filterName = filter + 'Filter';
    if (filterName === 'BlurPassFilter') {
      filterName = 'BlurFilterPass';
    }
    if (args.length > 0) {
      fx = new PIXI.filters[filterName](...args);
    } else {
      fx = new PIXI.filters[filterName]();
    }
    return addFilter(target, fx);
  };

  ct.filters = {};

  for (const filter of filters) {
    ct.filters['add' + filter] = (target, ...args) =>
      createFilter(target, filter, ...args);
  }

  ct.filters.remove = (target, filter) => {
    for (const f in target.filters) {
      if (target.filters[f] === filter) {
        target.filters.splice(f, 1);
      }
    }
  };

  ct.filters.custom = (target, vertex, fragment, uniforms) => {
    const fx = new PIXI.Filter(vertex, fragment, uniforms);
    return addFilter(target, fx);
  }

})();
