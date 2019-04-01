class CtAction {
    /**
     * Creates a new ct action.
     * 
     * @param {String} name The name of the new action.
     */
    constructor(name) {
        this.name = name;
        this.methodCodes = [];
        this.methodMultipliers = [];
        this.prevValue = 0;
        this.value = 0;
        return this;
    }
    /**
     * Checks whether the current action listens to a given input method.
     * This *does not* check whether this input method is supported by ct.
     * 
     * @param {String} code The code to look up.
     * @returns {Boolean} `true` if it exists, `false` otherwise.
     */
    methodExists(code) {
        return this.methodCodes.indexOf(code) !== -1;
    }
    /**
     * Adds a new input method to listen.
     * 
     * @param {String} code The input method's code to listen to. Must be unique per action.
     * @param {Number} [multiplier] An optional multiplier, e.g. to flip its value. Often used with two buttons to combine them into a scalar input identical to joysticks
     * @returns {void}
     */
    addMethod(code, multiplier) {
        if (this.methodCodes.indexOf(code) === -1) {
            this.methodCodes.push(code);
            this.methodMultipliers.push(multiplier !== void 0? multiplier : 1);
        } else {
            throw new Error(`[ct.inputs] An attempt to add an already added input "${code}" to an action "${name}".`);
        }
    }
    /**
     * Removes the provided input method for an action.
     * 
     * @param {String} code The input method to remove.
     * @returns {void}
     */
    removeMethod(code) {
        const ind = this.methodCodes.indexOf(code);
        if (ind !== -1) {
            this.methodCodes.splice(ind, 1);
            this.methodMultipliers.splice(ind, 1);
        }
    }
    /**
     * Changes the multiplier for an input method with the provided code.
     * This method will produce a warning if one is trying to change an input method
     * that is not listened by this action.
     * 
     * @param {String} code The input method's code to change
     * @param {Number} multiplier The new value
     * @returns {void}
     */
    setMultiplier(code, multiplier) {
        const ind = this.methodCodes.indexOf(code);
        if (ind !== -1) {
            this.methodMultipliers[ind] = multiplier;
        } else {
            console.warning(`[ct.inputs] An attempt to change multiplier of a non-existent method "${code}" at event ${this.name}`);
            console.trace();
        }
    }
    /**
     * Recalculates the digital value of an action.
     * 
     * @returns {Number} A scalar value between -1 and 1.
     */
    update() {
        this.prevValue = this.value;
        this.value = 0;
        for (let i = 0, l = this.methodCodes.length; i < l; i++) {
            this.value += (ct.inputs.registry[this.methodCodes[i]] || 0) * this.methodMultipliers[i];
        }
        this.value = Math.max(-1, Math.min(this.value, 1));
    }
    /**
     * Returns whether the action became active in the current frame,
     * either by a button just pressed or by using a scalar input.
     * @returns {Boolean} `true` for being pressed and `false` otherwise
     */
    get pressed() {
        return this.prevValue === 0 && this.value !== 0;
    }
    /**
     * Returns whether the action became inactive in the current frame,
     * either by releasing all buttons or by resting all scalar inputs. 
     * @returns {Boolean} `true` for being released and `false` otherwise
     */
    get released() {
        return this.prevValue !== 0 && this.value === 0;
    }
    /**
     * Returns whether the action is active, e.g. by a pressed button
     * or a currently used scalar input
     * @returns {Boolean} `true` for being active and `false` otherwise
     */
    get down() {
        return this.value !== 0;
    }
    /* In case you need to be hated for the rest of your life, uncomment this */
    /*
    valueOf() {
        return this.value;
    }
    */
}

ct.actions = {};
ct.inputs = {
    registry: {},
    /**
     * Adds a new action and puts it into `ct.actions`.
     * 
     * @param {String} name The name of an action, as it will be used in `ct.actions`.
     * @param {Array<Object>} methods A list of input methods. This list can be changed later.
     * @returns {CtAction} The created action
     */
    addAction(name, methods) {
        if (name in ct.actions) {
            throw new Error(`[ct.inputs] An action "${name}" already exists, can't add a new one with the same name.`);
        }
        const action = new CtAction(name);
        for (const method of methods) {
            action.addMethod(method.code, method.multiplier);
        }
        ct.actions[name] = action;
        return action;
    },
    /**
     * Removes an action with a given name.
     * @param {String} name The name of an action
     * @returns {void} 
     */
    removeAction(name) {
        delete ct.actions[name];
    },
    /**
     * Recalculates values for every action in a game.
     * @returns {void}
     */
    updateActions() {
        for (const i in ct.actions) {
            ct.actions[i].update();
        }
    }
};

/*@actions@*/
