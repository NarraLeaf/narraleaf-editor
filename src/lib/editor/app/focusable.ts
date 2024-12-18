import {EditorEventToken} from "@lib/editor/type";

export class Focusable {
    private focused: boolean = false;
    private strictFocused: boolean = false;
    private parent: Focusable | null = null;
    private children: Set<Focusable> = new Set();
    private onFocusedListeners: (() => void)[] = [];
    private onUnfocusedListeners: (() => void)[] = [];

    public focus() {
        this.getSuperParent().unfocusAll();
        this.strictFocused = this.focused = true;
        this.emitFocused();
        this.forEachParent((parent) => {
            parent.focused = true;
            parent.emitFocused();
        });
    }

    public unfocus() {
        this.strictFocused = this.focused = false;
        this.emitUnfocused();
        this.forEachParent((parent) => {
            parent.focused = false;
            parent.emitUnfocused();
        });
    }

    public link(parent?: Focusable | null): this {
        if (!parent) {
            return this;
        }
        this.parent = parent;
        parent.children.add(this);
        return this;
    }

    public unlink() {
        if (this.focused) {
            this.unfocus();
        }

        if (this.parent) {
            this.parent.children.delete(this);
            this.parent = null;
        }
        if (this.focused && !this.strictFocused) {
            this.forEachParent((parent) => {
                parent.focused = true;
                parent.emitFocused();
            });
        }
        this.reset();
    }

    public onFocused(callback: () => void): EditorEventToken {
        this.onFocusedListeners.push(callback);
        return {
            off: () => {
                this.onFocusedListeners = this.onFocusedListeners.filter((listener) => listener !== callback);
            }
        };
    }

    public onUnfocused(callback: () => void): EditorEventToken {
        this.onUnfocusedListeners.push(callback);
        return {
            off: () => {
                this.onUnfocusedListeners = this.onUnfocusedListeners.filter((listener) => listener !== callback);
            }
        };
    }

    public isFocused({strict = false}: { strict?: boolean } = {}): boolean {
        return strict ? this.strictFocused : this.focused;
    }

    public isStrictFocused(): boolean {
        return this.strictFocused;
    }

    private reset() {
        this.focused = this.strictFocused = false;
        this.emitUnfocused();
        return Array.from(this.children).map((child) => {
            child.reset();
        });
    }

    private emitFocused() {
        this.onFocusedListeners.forEach((callback) => {
            callback();
        });
    }

    private emitUnfocused() {
        this.onUnfocusedListeners.forEach((callback) => {
            callback();
        });
    }

    private unfocusAll() {
        this.strictFocused = this.focused = false;
        this.forEachChild((child) => {
            child.focused = child.strictFocused = false;
            child.emitUnfocused();
        });
    }

    private forEachParent(callback: (parent: Focusable) => void) {
        let parent = this.parent;
        while (parent) {
            callback(parent);
            parent = parent.parent;
        }
    }

    private getSuperParent(): Focusable {
        let parent = this.parent;
        while (parent) {
            if (!parent.hasParent()) {
                return parent;
            }
            parent = parent.parent;
        }
        return this;
    }

    private hasParent(): boolean {
        return !!this.parent;
    }

    private forEachChild(callback: (child: Focusable) => void) {
        const seen = new Set<Focusable>();
        const queue = Array.from(this.children);

        while (queue.length > 0) {
            const current = queue.shift();
            if (!current || seen.has(current)) {
                continue;
            }
            seen.add(current);
            callback(current);
            queue.push(...current.children);
        }
    }
}

