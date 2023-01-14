export const initMongo = async (mongoose, uri) => {
    _setSafe(mongoose, "useNewUrlParser", true);
    _setSafe(mongoose, "useFindAndModify", false);
    _setSafe(mongoose, "useCreateIndex", true);
    _setSafe(mongoose, "useUnifiedTopology", true);
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
};

export const destroyMongo = mongoose => {
    mongoose.disconnect();
};

const _setSafe = (mongoose, key, value) => {
    try {
        mongoose.set(key, value);
    } catch (err) {}
};
