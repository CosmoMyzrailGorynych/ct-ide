/* Based on https://github.com/luser/gamepadtest */

(function() {
  const standardMapping = {
    controllers: {},
    buttonsMapping: [
      'Button1',
      'Button2',
      'Button3',
      'Button4',
      'L1',
      'R1',
      'L2',
      'R2',
      'Select',
      'Start',
      // here, must have same name as in module.js
      'L3',
      //'LStickButton',
      // here, too...
      'R3',
      //'RStickButton',
      // up, down, left and right are all mapped as axes.
      'Up',
      'Down',
      'Left',
      'Right'

      // + a special button code `Any`, that requires special handling
    ],
    axesMapping: ['LStickX', 'LStickY', 'RStickX', 'RStickY']
  };

  const prefix = 'gamepad.';

  const setRegistry = function(key, value) {
    ct.inputs.registry[prefix + key] = value;
  };
  const getRegistry = function(key) {
    return ct.inputs.registry[prefix + key] || 0;
  };

  const getGamepads = function() {
    return navigator.getGamepads();
  };

  const addGamepad = function(gamepad) {
    standardMapping.controllers[gamepad.index] = gamepad;
  };

  const scanGamepads = function() {
    const gamepads = getGamepads();
    for (let i = 0, len = gamepads.length; i < len; i++) {
      if (gamepads[i]) {
        const {controllers} = standardMapping;
        if (!(gamepads[i].index in controllers)) {
          // add new gamepad object
          addGamepad(gamepads[i]);
        } else {
          // update gamepad object state
          controllers[gamepads[i].index] = gamepads[i];
        }
      }
    }
  };

  const updateStatus = function() {
    scanGamepads();
    let j;
    const {controllers} = standardMapping;
    const {buttonsMapping} = standardMapping;
    const {axesMapping} = standardMapping;
    for (j in controllers) {
      /**
       * @type {Gamepad}
       */
      const controller = controllers[j];
      const buttonsLen = controller.buttons.length;

      // Reset the 'any button' input
      setRegistry('Any', 0);
      // loop through all the known button codes and update their state
      for (let i = 0; i < buttonsLen; i++) {
        setRegistry(buttonsMapping[i], controller.buttons[i].value);
        // update the 'any button', if needed
        setRegistry('Any', Math.max(getRegistry('Any'), controller.buttons[i].value));
        ct.gamepad.lastButton = buttonsMapping[i];
      }

      // loop through all the known axes and update their state
      const axesLen = controller.axes.length;
      for (let i = 0; i < axesLen; i++) {
        setRegistry(axesMapping[i], controller.axes[i]);
      }
    }
  };

  ct.gamepad = Object.assign(new PIXI.utils.EventEmitter(), {
    list: getGamepads(),
    connected(e) {
      ct.gamepad.emit('connected', e.gamepad, e);
      addGamepad(e.gamepad);
    },
    disconnected(e) {
      ct.gamepad.emit('disconnected', e.gamepad, e);
      delete standardMapping.controllers[e.gamepad.index];
    },
    getButton: code => {
      if (standardMapping.buttonsMapping.indexOf(code) === -1 && code !== 'Any') {
        throw new Error(`[ct.gamepad] Attempt to get the state of a non-existing button ${code}. A typo?`);
      }
      return getRegistry(code);
    },
    getAxis: code => {
      if (standardMapping.axesMapping.indexOf(code) === -1) {
        throw new Error(`[ct.gamepad] Attempt to get the state of a non-existing axis ${code}. A typo?`);
      }
      return getRegistry(code);
    },
    lastButton: null
  });

  // register events
  window.addEventListener('gamepadconnected', ct.gamepad.connected);
  window.addEventListener('gamepaddisconnected', ct.gamepad.disconnected);
  // register a ticker listener
  ct.pixiApp.ticker.add(updateStatus);
})();
