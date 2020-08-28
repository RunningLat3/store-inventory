const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLSchema } = graphql;
const MongoDBOptions = require('../utils/mongodb-options');
const { ValidationError, ApolloError } = require('apollo-server-express');
const Item = require('../model/item');
const Brand = require('../model/brand');
const Category = require('../model/category');

// ITEM SCHEMA
const ItemType = new GraphQLObjectType({
    name: 'Item',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        image: { type: new GraphQLList(GraphQLString) },
        description: { type: GraphQLString },
        serialNumber: { type: GraphQLString },
        category: {
            type: CategoryType,
            async resolve(parent, args) {
                return await Category.findById(parent.categoryId);
            }
        },
        productionDate: { type: GraphQLString },
        expiryDate: { type: GraphQLString },
        price: { type: GraphQLFloat },
        brand: {
            type: BrandType,
            async resolve(parent, args) {
                return await Brand.findById(parent.brandId);
            }
        }
    })
});

const ItemQuery = {
    item: {
        type: ItemType,
        args: { id: { type: GraphQLID } },
        async resolve(parent, args) {
            return await Item.findById(args.id);
        }
    },
    items: {
        type: new GraphQLList(ItemType),
        async resolve(parent, args) {
            return await Item.find({});
        }
    },
};

const ItemMutation = {
    addItem: {
        type: ItemType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            image: { type: new GraphQLList(GraphQLString) },
            description: { type: GraphQLString },
            serialNumber: { type: new GraphQLNonNull(GraphQLString) },
            categoryId: { type: new GraphQLNonNull(GraphQLID) },
            productionDate: { type: new GraphQLNonNull(GraphQLString) },
            expiryDate: { type: new GraphQLNonNull(GraphQLString) },
            price: { type: new GraphQLNonNull(GraphQLFloat) },
            brandId: { type: new GraphQLNonNull(GraphQLID) },
        },
        async resolve(parent, args) {
            let item = new Item(args);

            return await item.save().catch(err => console.log(err));;
        }
    },
    updateItem: {
        type: ItemType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            name: { type: new GraphQLNonNull(GraphQLString) },
            image: { type: new GraphQLList(GraphQLString) },
            description: { type: GraphQLString },
            serialNumber: { type: new GraphQLNonNull(GraphQLString) },
            categoryId: { type: GraphQLID },
            productionDate: { type: new GraphQLNonNull(GraphQLString) },
            expiryDate: { type: new GraphQLNonNull(GraphQLString) },
            price: { type: new GraphQLNonNull(GraphQLFloat) },
            brandId: { type: GraphQLID },
        },
        async resolve(parent, args) {
            const { id, ...rest } = args

            return await Item.findByIdAndUpdate(id, rest, MongoDBOptions.generalUpdateOptions).catch(err => {
                //if no result found log err.
                console.log(err)
                return err;
            });
        }
    },
    removeItem: {
        type: ItemType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        async resolve(parent, args) {
            const { id } = args;
            return await Item.findByIdAndRemove(id, MongoDBOptions.generalDeleteOptions).catch(err => {
                //if no result found log err.
                console.log(err)
                return err;
            });
        }
    }
};

// BRAND SCHEMA
const BrandType = new GraphQLObjectType({
    name: 'Brand',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        logo: { type: GraphQLString },
        items: {
            type: new GraphQLList(ItemType),
            async resolve(parent, args) {
                return await Item.find({ brandId: parent.id });
            }
        }
    })
});

const BrandQuery = {
    brand: {
        type: BrandType,
        args: { id: { type: GraphQLID } },
        async resolve(parent, args) {
            const brandDoc = await Brand.findById(args.id);
            return brandDoc || new ValidationError("Brand ID not found");
        }
    },
    brands: {
        type: new GraphQLList(BrandType),
        async resolve(parent, args) {
            return await Brand.find({});
        }
    },
};

const BrandMutation = {
    //BRANDS
    addBrand: {
        type: BrandType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            logo: { type: GraphQLString },
        },
        async resolve(parent, args) {
            let brand = new Brand(args);
            return await brand.save().catch(err => console.log(err));
        }
    },
    updateBrand: {
        type: BrandType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            name: { type: new GraphQLNonNull(GraphQLString) },
            logo: { type: GraphQLString },
        },
        async resolve(parent, args) {
            const { id, ...rest } = args
            return await Brand.findByIdAndUpdate(id, rest, MongoDBOptions.generalUpdateOptions).catch(err => {
                //if no result found log err.
                console.log(err)
                return err;
            });
        }
    },
    removeBrand: {
        type: BrandType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        async resolve(parent, args) {
            const { id } = args;
            return await Brand.findByIdAndRemove(id, MongoDBOptions.generalDeleteOptions).catch(err => {
                //if no result found log err.
                console.log(err)
                return err;
            });
        }
    }
};

// CATEGORY COLLECTIONS
const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        items: {
            type: new GraphQLList(ItemType),
            async resolve(parent, args) {
                return await Item.find({ categorId: parent.id });
            }
        }
    })
});

const CategoryQuery = {
    category: {
        type: CategoryType,
        args: { id: { type: GraphQLID } },
        async resolve(parent, args) {
            return await Category.findById(args.id);
        }
    },
    categories: {
        type: new GraphQLList(CategoryType),
        async resolve(parent, args) {
            return await Category.find({});
        }
    }
};

const CategoryMutation = {

};


// GET DATA
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        ...ItemQuery,
        ...BrandQuery,
        ...CategoryQuery
    }
});

// UPDATE, DELETE, CREATE DATA 
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        ...ItemMutation,
        ...BrandMutation,
        ...CategoryMutation
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});