export const browserRollup = function() {
    return {
        name: "fs",
        resolveId: function(importee) {
            if (importee === "fs") {
                return importee;
            }
            if (importee === "node-fetch") {
                return importee;
            }
            return null;
        },
        load: function(id) {
            if (id === "fs") {
                return "export const promises = {};";
            }
            if (id === "node-fetch") {
                return "export default fetch;";
            }
            return null;
        }
    };
};

export default browserRollup;
