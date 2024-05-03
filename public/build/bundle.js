
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35734/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Location.svelte generated by Svelte v3.59.2 */
    const file$4 = "src/Location.svelte";

    // (36:0) {:else}
    function create_else_block_1(ctx) {
    	let categorylist;
    	let current;
    	categorylist = new CategoryList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(categorylist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(categorylist, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(categorylist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(categorylist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(categorylist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(36:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (12:0) {#if click}
    function create_if_block$4(ctx) {
    	let h2;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let t4;
    	let if_block_anchor;
    	let if_block = /*location*/ ctx[1] && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(/*bookTitle*/ ctx[0]);
    			t1 = space();
    			p = element("p");
    			t2 = text("Location: ");
    			t3 = text(/*location*/ ctx[1]);
    			t4 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(h2, "class", "svelte-180s4k7");
    			add_location(h2, file$4, 12, 0, 219);
    			attr_dev(p, "class", "svelte-180s4k7");
    			add_location(p, file$4, 13, 0, 240);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			insert_dev(target, t4, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*bookTitle*/ 1) set_data_dev(t0, /*bookTitle*/ ctx[0]);
    			if (dirty & /*location*/ 2) set_data_dev(t3, /*location*/ ctx[1]);

    			if (/*location*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t4);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(12:0) {#if click}",
    		ctx
    	});

    	return block;
    }

    // (15:0) {#if location}
    function create_if_block_1$2(ctx) {
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*location*/ ctx[1] === 'Clock Tower') return create_if_block_2$1;
    		if (/*location*/ ctx[1] === 'Book Cart') return create_if_block_3$1;
    		if (/*location*/ ctx[1] === 'Wooden Crates') return create_if_block_4$1;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t0 = space();
    			button = element("button");
    			button.textContent = "Find Another Book!";
    			attr_dev(button, "class", "svelte-180s4k7");
    			add_location(button, file$4, 33, 4, 1029);
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleClick*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(15:0) {#if location}",
    		ctx
    	});

    	return block;
    }

    // (31:4) {:else}
    function create_else_block$2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No specific instruction available.";
    			attr_dev(p, "class", "svelte-180s4k7");
    			add_location(p, file$4, 31, 8, 973);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(31:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (26:43) 
    function create_if_block_4$1(ctx) {
    	let p;
    	let t1;
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Cast your gaze to the left and discover the book you seek!";
    			t1 = space();
    			div = element("div");
    			img = element("img");
    			attr_dev(p, "class", "svelte-180s4k7");
    			add_location(p, file$4, 26, 8, 768);
    			if (!src_url_equal(img.src, img_src_value = "./arrow.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Left Arrow");
    			attr_dev(img, "class", "arrow-img svelte-180s4k7");
    			add_location(img, file$4, 28, 12, 879);
    			attr_dev(div, "class", "arrow-left svelte-180s4k7");
    			add_location(div, file$4, 27, 8, 842);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(26:43) ",
    		ctx
    	});

    	return block;
    }

    // (21:39) 
    function create_if_block_3$1(ctx) {
    	let p;
    	let t1;
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Look down and unearth the book you seek!";
    			t1 = space();
    			div = element("div");
    			img = element("img");
    			attr_dev(p, "class", "svelte-180s4k7");
    			add_location(p, file$4, 21, 8, 549);
    			if (!src_url_equal(img.src, img_src_value = "./arrow.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Down Arrow");
    			attr_dev(img, "class", "arrow-img svelte-180s4k7");
    			add_location(img, file$4, 23, 12, 642);
    			attr_dev(div, "class", "arrow-down svelte-180s4k7");
    			add_location(div, file$4, 22, 8, 605);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(21:39) ",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#if location === 'Clock Tower'}
    function create_if_block_2$1(ctx) {
    	let p;
    	let t1;
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Look to the right to find the book you seek!";
    			t1 = space();
    			div = element("div");
    			img = element("img");
    			attr_dev(p, "class", "svelte-180s4k7");
    			add_location(p, file$4, 16, 8, 328);
    			if (!src_url_equal(img.src, img_src_value = "./arrow.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Right Arrow");
    			attr_dev(img, "class", "arrow-img svelte-180s4k7");
    			add_location(img, file$4, 18, 12, 426);
    			attr_dev(div, "class", "arrow-right svelte-180s4k7");
    			add_location(div, file$4, 17, 8, 388);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(16:4) {#if location === 'Clock Tower'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*click*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Location', slots, []);
    	let { bookTitle } = $$props;
    	let { location } = $$props;
    	let click = true;

    	function handleClick() {
    		$$invalidate(2, click = false);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (bookTitle === undefined && !('bookTitle' in $$props || $$self.$$.bound[$$self.$$.props['bookTitle']])) {
    			console.warn("<Location> was created without expected prop 'bookTitle'");
    		}

    		if (location === undefined && !('location' in $$props || $$self.$$.bound[$$self.$$.props['location']])) {
    			console.warn("<Location> was created without expected prop 'location'");
    		}
    	});

    	const writable_props = ['bookTitle', 'location'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Location> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('bookTitle' in $$props) $$invalidate(0, bookTitle = $$props.bookTitle);
    		if ('location' in $$props) $$invalidate(1, location = $$props.location);
    	};

    	$$self.$capture_state = () => ({
    		bookTitle,
    		location,
    		click,
    		CategoryList,
    		handleClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('bookTitle' in $$props) $$invalidate(0, bookTitle = $$props.bookTitle);
    		if ('location' in $$props) $$invalidate(1, location = $$props.location);
    		if ('click' in $$props) $$invalidate(2, click = $$props.click);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [bookTitle, location, click, handleClick];
    }

    class Location extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { bookTitle: 0, location: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Location",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get bookTitle() {
    		throw new Error("<Location>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bookTitle(value) {
    		throw new Error("<Location>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get location() {
    		throw new Error("<Location>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set location(value) {
    		throw new Error("<Location>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/BookDetails.svelte generated by Svelte v3.59.2 */

    const { console: console_1$2 } = globals;
    const file$3 = "src/BookDetails.svelte";

    // (52:2) {#if bookInfo}
    function create_if_block_1$1(ctx) {
    	let h2;
    	let t0_value = /*bookInfo*/ ctx[1].Title + "";
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let button;
    	let mounted;
    	let dispose;
    	let if_block0 = /*bookInfo*/ ctx[1].Author && create_if_block_5(ctx);
    	let if_block1 = /*bookInfo*/ ctx[1]['Edition Date'] && create_if_block_4(ctx);
    	let if_block2 = /*bookInfo*/ ctx[1].Publisher && create_if_block_3(ctx);
    	let if_block3 = /*bookInfo*/ ctx[1].Description && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			button = element("button");
    			button.textContent = "Find Me!";
    			attr_dev(h2, "class", "svelte-tqmw13");
    			add_location(h2, file$3, 52, 4, 1505);
    			attr_dev(button, "class", "svelte-tqmw13");
    			add_location(button, file$3, 65, 4, 1907);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleFindMe*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*bookInfo*/ 2 && t0_value !== (t0_value = /*bookInfo*/ ctx[1].Title + "")) set_data_dev(t0, t0_value);

    			if (/*bookInfo*/ ctx[1].Author) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					if_block0.m(t2.parentNode, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*bookInfo*/ ctx[1]['Edition Date']) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*bookInfo*/ ctx[1].Publisher) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3(ctx);
    					if_block2.c();
    					if_block2.m(t4.parentNode, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*bookInfo*/ ctx[1].Description) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_2(ctx);
    					if_block3.c();
    					if_block3.m(t5.parentNode, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(52:2) {#if bookInfo}",
    		ctx
    	});

    	return block;
    }

    // (49:0) {#if locationInfo}
    function create_if_block$3(ctx) {
    	let location;
    	let current;

    	location = new Location({
    			props: {
    				bookTitle: /*bookTitle*/ ctx[0],
    				location: /*locationInfo*/ ctx[2].location
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(location.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(location, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const location_changes = {};
    			if (dirty & /*bookTitle*/ 1) location_changes.bookTitle = /*bookTitle*/ ctx[0];
    			if (dirty & /*locationInfo*/ 4) location_changes.location = /*locationInfo*/ ctx[2].location;
    			location.$set(location_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(location.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(location.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(location, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(49:0) {#if locationInfo}",
    		ctx
    	});

    	return block;
    }

    // (54:4) {#if bookInfo.Author}
    function create_if_block_5(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*bookInfo*/ ctx[1].Author + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Author: ");
    			t1 = text(t1_value);
    			attr_dev(p, "class", "svelte-tqmw13");
    			add_location(p, file$3, 54, 6, 1563);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*bookInfo*/ 2 && t1_value !== (t1_value = /*bookInfo*/ ctx[1].Author + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(54:4) {#if bookInfo.Author}",
    		ctx
    	});

    	return block;
    }

    // (57:4) {#if bookInfo['Edition Date']}
    function create_if_block_4(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*bookInfo*/ ctx[1]['Edition Date'] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Publication Date: ");
    			t1 = text(t1_value);
    			attr_dev(p, "class", "svelte-tqmw13");
    			add_location(p, file$3, 57, 6, 1647);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*bookInfo*/ 2 && t1_value !== (t1_value = /*bookInfo*/ ctx[1]['Edition Date'] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(57:4) {#if bookInfo['Edition Date']}",
    		ctx
    	});

    	return block;
    }

    // (60:4) {#if bookInfo.Publisher}
    function create_if_block_3(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*bookInfo*/ ctx[1].Publisher + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Publisher: ");
    			t1 = text(t1_value);
    			attr_dev(p, "class", "svelte-tqmw13");
    			add_location(p, file$3, 60, 6, 1744);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*bookInfo*/ 2 && t1_value !== (t1_value = /*bookInfo*/ ctx[1].Publisher + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(60:4) {#if bookInfo.Publisher}",
    		ctx
    	});

    	return block;
    }

    // (63:4) {#if bookInfo.Description}
    function create_if_block_2(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*bookInfo*/ ctx[1].Description + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Description: ");
    			t1 = text(t1_value);
    			attr_dev(p, "class", "description svelte-tqmw13");
    			add_location(p, file$3, 63, 6, 1830);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*bookInfo*/ 2 && t1_value !== (t1_value = /*bookInfo*/ ctx[1].Description + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(63:4) {#if bookInfo.Description}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_if_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*locationInfo*/ ctx[2]) return 0;
    		if (/*bookInfo*/ ctx[1]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BookDetails', slots, []);
    	let click = true;
    	let { bookTitle } = $$props;
    	let bookInfo = null;
    	let locationInfo = null;

    	async function fetchBookDetails(title) {
    		try {
    			//const response = await fetch(`http://localhost:3000/search?title=${encodeURIComponent(title)}`);
    			const response = await fetch(`https://book-server-n6xk.onrender.com/search?title=${encodeURIComponent(title)}`);

    			if (response.ok) {
    				$$invalidate(1, bookInfo = await response.json());
    			} else {
    				console.error('Failed to fetch book details:', response.statusText);
    			}
    		} catch(error) {
    			console.error('Error fetching book details:', error);
    		}
    	}

    	async function fetchLocation(title) {
    		try {
    			const response = await fetch(`https://book-server-n6xk.onrender.com/book-location/${encodeURIComponent(title)}`);

    			if (response.ok) {
    				$$invalidate(2, locationInfo = await response.json());
    			} else {
    				console.error('Failed to fetch location:', response.statusText);
    			}
    		} catch(error) {
    			console.error('Error fetching location:', error);
    		}
    	}

    	// Fetch book details when the component is mounted
    	onMount(async () => {
    		await fetchBookDetails(bookTitle);
    	});

    	async function handleFindMe() {
    		await fetchLocation(bookTitle);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (bookTitle === undefined && !('bookTitle' in $$props || $$self.$$.bound[$$self.$$.props['bookTitle']])) {
    			console_1$2.warn("<BookDetails> was created without expected prop 'bookTitle'");
    		}
    	});

    	const writable_props = ['bookTitle'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<BookDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('bookTitle' in $$props) $$invalidate(0, bookTitle = $$props.bookTitle);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Location,
    		click,
    		bookTitle,
    		bookInfo,
    		locationInfo,
    		fetchBookDetails,
    		fetchLocation,
    		handleFindMe
    	});

    	$$self.$inject_state = $$props => {
    		if ('click' in $$props) click = $$props.click;
    		if ('bookTitle' in $$props) $$invalidate(0, bookTitle = $$props.bookTitle);
    		if ('bookInfo' in $$props) $$invalidate(1, bookInfo = $$props.bookInfo);
    		if ('locationInfo' in $$props) $$invalidate(2, locationInfo = $$props.locationInfo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [bookTitle, bookInfo, locationInfo, handleFindMe];
    }

    class BookDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { bookTitle: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BookDetails",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get bookTitle() {
    		throw new Error("<BookDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bookTitle(value) {
    		throw new Error("<BookDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/BookList.svelte generated by Svelte v3.59.2 */

    const { console: console_1$1 } = globals;
    const file$2 = "src/BookList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (45:0) {:else}
    function create_else_block$1(ctx) {
    	let bookdetails;
    	let current;

    	bookdetails = new BookDetails({
    			props: { bookTitle: /*selectedBookTitle*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(bookdetails.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bookdetails, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const bookdetails_changes = {};
    			if (dirty & /*selectedBookTitle*/ 4) bookdetails_changes.bookTitle = /*selectedBookTitle*/ ctx[2];
    			bookdetails.$set(bookdetails_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bookdetails.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bookdetails.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bookdetails, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(45:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (38:0) {#if !showBookDetails}
    function create_if_block$2(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let each_value = /*books*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Pick a Book to Learn More!";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "svelte-9ahtzz");
    			add_location(h2, file$2, 39, 2, 1003);
    			add_location(div, file$2, 38, 0, 995);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*handleClick, books*/ 9) {
    				each_value = /*books*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(38:0) {#if !showBookDetails}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#each books as bookTitle}
    function create_each_block$1(ctx) {
    	let button;
    	let t_value = /*bookTitle*/ ctx[7] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*bookTitle*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "book-button svelte-9ahtzz");
    			add_location(button, file$2, 41, 4, 1072);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*books*/ 1 && t_value !== (t_value = /*bookTitle*/ ctx[7] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(41:2) {#each books as bookTitle}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*showBookDetails*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BookList', slots, []);
    	let { selectedCategory } = $$props;
    	let books = [];
    	let showBookDetails = false;
    	let selectedBookTitle = '';

    	// Function to fetch book titles for the selected category
    	async function fetchBooks(groupName) {
    		try {
    			const response = await fetch(`https://book-server-n6xk.onrender.com/books/${groupName}`);

    			if (response.ok) {
    				const data = await response.json();
    				$$invalidate(0, books = data.bookTitles);
    			} else {
    				console.error('Failed to fetch books:', response.statusText);
    			}
    		} catch(error) {
    			console.error('Error fetching books:', error);
    		}
    	}

    	// Function to handle button click event
    	function handleClick(bookTitle) {
    		$$invalidate(1, showBookDetails = true);
    		$$invalidate(2, selectedBookTitle = bookTitle);
    	}

    	// Fetch books when the component is mounted
    	onMount(async () => {
    		await fetchBooks(selectedCategory);
    	});

    	$$self.$$.on_mount.push(function () {
    		if (selectedCategory === undefined && !('selectedCategory' in $$props || $$self.$$.bound[$$self.$$.props['selectedCategory']])) {
    			console_1$1.warn("<BookList> was created without expected prop 'selectedCategory'");
    		}
    	});

    	const writable_props = ['selectedCategory'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<BookList> was created with unknown prop '${key}'`);
    	});

    	const click_handler = bookTitle => handleClick(bookTitle);

    	$$self.$$set = $$props => {
    		if ('selectedCategory' in $$props) $$invalidate(4, selectedCategory = $$props.selectedCategory);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		BookDetails,
    		selectedCategory,
    		books,
    		showBookDetails,
    		selectedBookTitle,
    		fetchBooks,
    		handleClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('selectedCategory' in $$props) $$invalidate(4, selectedCategory = $$props.selectedCategory);
    		if ('books' in $$props) $$invalidate(0, books = $$props.books);
    		if ('showBookDetails' in $$props) $$invalidate(1, showBookDetails = $$props.showBookDetails);
    		if ('selectedBookTitle' in $$props) $$invalidate(2, selectedBookTitle = $$props.selectedBookTitle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		books,
    		showBookDetails,
    		selectedBookTitle,
    		handleClick,
    		selectedCategory,
    		click_handler
    	];
    }

    class BookList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { selectedCategory: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BookList",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get selectedCategory() {
    		throw new Error("<BookList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedCategory(value) {
    		throw new Error("<BookList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/CategoryList.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file$1 = "src/CategoryList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (40:0) {:else}
    function create_else_block(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let each_value = /*categories*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "What Do You Want To Read?";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "svelte-1gpb7os");
    			add_location(h2, file$1, 41, 4, 1342);
    			add_location(div, file$1, 40, 2, 1332);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*handleCategoryClick, categories*/ 9) {
    				each_value = /*categories*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(40:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (38:0) {#if showBookList}
    function create_if_block$1(ctx) {
    	let booklist;
    	let current;

    	booklist = new BookList({
    			props: {
    				selectedCategory: /*selectedCategory*/ ctx[1]
    			},
    			$$inline: true
    		});

    	booklist.$on("back", /*handleBackClick*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(booklist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(booklist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const booklist_changes = {};
    			if (dirty & /*selectedCategory*/ 2) booklist_changes.selectedCategory = /*selectedCategory*/ ctx[1];
    			booklist.$set(booklist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(booklist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(booklist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(booklist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(38:0) {#if showBookList}",
    		ctx
    	});

    	return block;
    }

    // (43:4) {#each categories as groupName}
    function create_each_block(ctx) {
    	let button;
    	let t_value = /*groupName*/ ctx[7] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*groupName*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "category-button svelte-1gpb7os");
    			add_location(button, file$1, 43, 6, 1419);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*categories*/ 1 && t_value !== (t_value = /*groupName*/ ctx[7] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(43:4) {#each categories as groupName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*showBookList*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CategoryList', slots, []);
    	let categories = [];
    	let selectedCategory = null;
    	let showBookList = false; // State variable to control rendering

    	async function getCategories() {
    		try {
    			// const response = await fetch('http://localhost:3000/');
    			const response = await fetch('https://book-server-n6xk.onrender.com/');

    			if (response.ok) {
    				$$invalidate(0, categories = await response.json());
    			} else {
    				console.error('Failed to fetch categories:', response.statusText);
    			}
    		} catch(error) {
    			console.error('Error fetching categories:', error);
    		}
    	}

    	getCategories();

    	// Function to handle category button click event
    	function handleCategoryClick(groupName) {
    		console.log("Clicked Category:", groupName);
    		$$invalidate(1, selectedCategory = groupName); // Set the selected category
    		$$invalidate(2, showBookList = true); // Set the state variable to show BookList
    	}

    	// Function to handle going back to category list
    	function handleBackClick() {
    		$$invalidate(2, showBookList = false); // Set the state variable to show CategoryList
    		$$invalidate(1, selectedCategory = null); // Reset selected category
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<CategoryList> was created with unknown prop '${key}'`);
    	});

    	const click_handler = groupName => handleCategoryClick(groupName);

    	$$self.$capture_state = () => ({
    		BookList,
    		categories,
    		selectedCategory,
    		showBookList,
    		getCategories,
    		handleCategoryClick,
    		handleBackClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) $$invalidate(0, categories = $$props.categories);
    		if ('selectedCategory' in $$props) $$invalidate(1, selectedCategory = $$props.selectedCategory);
    		if ('showBookList' in $$props) $$invalidate(2, showBookList = $$props.showBookList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		categories,
    		selectedCategory,
    		showBookList,
    		handleCategoryClick,
    		handleBackClick,
    		click_handler
    	];
    }

    class CategoryList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CategoryList",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    // (15:4) {#if !currentComponent}
    function create_if_block_1(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let p;
    	let t3;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Welcome to the Book Finder!";
    			t1 = space();
    			div = element("div");
    			p = element("p");
    			p.textContent = "There are so many wonderful stories to read! Look through the different categories to find a book.";
    			t3 = space();
    			button = element("button");
    			button.textContent = "Find a Book!";
    			attr_dev(h1, "class", "svelte-19tumui");
    			add_location(h1, file, 15, 8, 337);
    			attr_dev(p, "class", "svelte-19tumui");
    			add_location(p, file, 17, 12, 428);
    			attr_dev(div, "class", "paragraph-container svelte-19tumui");
    			add_location(div, file, 16, 8, 382);
    			attr_dev(button, "class", "svelte-19tumui");
    			add_location(button, file, 19, 8, 557);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggleCategories*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(15:4) {#if !currentComponent}",
    		ctx
    	});

    	return block;
    }

    // (23:4) {#if currentComponent}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*currentComponent*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentComponent*/ 1 && switch_value !== (switch_value = /*currentComponent*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(23:4) {#if currentComponent}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block0 = !/*currentComponent*/ ctx[0] && create_if_block_1(ctx);
    	let if_block1 = /*currentComponent*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "container svelte-19tumui");
    			add_location(div, file, 13, 0, 277);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*currentComponent*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*currentComponent*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*currentComponent*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let currentComponent = null;
    	let categories = [];

    	const toggleCategories = () => {
    		$$invalidate(0, currentComponent = CategoryList);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		CategoryList,
    		currentComponent,
    		categories,
    		toggleCategories
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentComponent' in $$props) $$invalidate(0, currentComponent = $$props.currentComponent);
    		if ('categories' in $$props) categories = $$props.categories;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentComponent, toggleCategories];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
