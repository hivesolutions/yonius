const assert = require("assert");
const yonius = require("../..");

describe("MixinBuilder", function() {
    describe("#with()", function() {
        it("should be able to apply a single mixin", () => {
            class BaseClass {
                constructor() {
                    this.base = true;
                }
            }

            const LogMixin = superclass =>
                class extends superclass {
                    log(message) {
                        return `Log: ${message}`;
                    }
                };

            const MixedClass = yonius.mix(BaseClass).with(LogMixin);
            const instance = new MixedClass();

            assert.strictEqual(instance.base, true);
            assert.strictEqual(typeof instance.log, "function");
            assert.strictEqual(instance.log("hello"), "Log: hello");
        });

        it("should be able to apply multiple mixins", () => {
            class BaseClass {
                constructor() {
                    this.base = true;
                }
            }

            const LogMixin = superclass =>
                class extends superclass {
                    log(message) {
                        return `Log: ${message}`;
                    }
                };

            const TimestampMixin = superclass =>
                class extends superclass {
                    timestamp() {
                        return new Date().toISOString();
                    }
                };

            const MathMixin = superclass =>
                class extends superclass {
                    add(a, b) {
                        return a + b;
                    }
                };

            const MixedClass = yonius.mix(BaseClass).with(LogMixin, TimestampMixin, MathMixin);
            const instance = new MixedClass();

            assert.strictEqual(instance.base, true);
            assert.strictEqual(typeof instance.log, "function");
            assert.strictEqual(typeof instance.timestamp, "function");
            assert.strictEqual(typeof instance.add, "function");
            assert.strictEqual(instance.log("test"), "Log: test");
            assert.strictEqual(instance.add(2, 3), 5);
            assert.strictEqual(typeof instance.timestamp(), "string");
        });

        it("should maintain inheritance chain", () => {
            class Animal {
                constructor(name) {
                    this.name = name;
                }

                speak() {
                    return `${this.name} makes a sound`;
                }
            }

            const FlyMixin = superclass =>
                class extends superclass {
                    fly() {
                        return `${this.name} is flying`;
                    }
                };

            const SwimMixin = superclass =>
                class extends superclass {
                    swim() {
                        return `${this.name} is swimming`;
                    }
                };

            const MixedAnimal = yonius.mix(Animal).with(FlyMixin, SwimMixin);
            const duck = new MixedAnimal("Duck");

            assert.strictEqual(duck.name, "Duck");
            assert.strictEqual(duck.speak(), "Duck makes a sound");
            assert.strictEqual(duck.fly(), "Duck is flying");
            assert.strictEqual(duck.swim(), "Duck is swimming");
            assert.strictEqual(duck instanceof Animal, true);
        });

        it("should handle mixin with shared state", () => {
            class Counter {
                constructor() {
                    this.count = 0;
                }
            }

            const IncrementMixin = superclass =>
                class extends superclass {
                    increment() {
                        this.count++;
                        return this.count;
                    }
                };

            const DoubleMixin = superclass =>
                class extends superclass {
                    double() {
                        this.count *= 2;
                        return this.count;
                    }
                };

            const MixedCounter = yonius.mix(Counter).with(IncrementMixin, DoubleMixin);
            const counter = new MixedCounter();

            assert.strictEqual(counter.count, 0);
            assert.strictEqual(counter.increment(), 1);
            assert.strictEqual(counter.increment(), 2);
            assert.strictEqual(counter.double(), 4);
            assert.strictEqual(counter.increment(), 5);
        });

        it("should work with no mixins", () => {
            class BaseClass {
                getValue() {
                    return 42;
                }
            }

            const MixedClass = yonius.mix(BaseClass).with();
            const instance = new MixedClass();

            assert.strictEqual(typeof instance.getValue, "function");
            assert.strictEqual(instance.getValue(), 42);
        });
    });
});
