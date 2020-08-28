const GeneralUpdateOptions = {
    new: true,
    maxTimeMS: 120000,
    runValidators: true,
};

const GeneralDeleteOptions = {
    maxTimeMS: 120000,
};

module.exports = MongoDBOptions = {
    generalUpdateOptions: GeneralUpdateOptions,
    generalDeleteOptions: GeneralDeleteOptions
};