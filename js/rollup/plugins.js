export const yoniusRollup = function() {
    return {
        name: "yonius",
        resolveId: function(importee) {
            switch (importee) {
                case "fs":
                case "node-fetch":
                    return importee;
                default:
                    return null;
            }
        },
        load: function(id) {
            switch (id) {
                case "fs":
                    return "export const promises = {};";
                case "node-fetch":
                    return "export default fetch;";
                default:
                    return null;
            }
        }
    };
};

export default yoniusRollup;
