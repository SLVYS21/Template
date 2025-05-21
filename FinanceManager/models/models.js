const { default: mongoose } = require("mongoose");

const Account = new mongoose.Schema({
    nom: {type: String, required: true},
    sold: {type: Number, default: 0}, //Uneditable
    default_sold: {type: Number, default: 0},
    devise: {type: mongoose.Schema.Types.ObjectId, ref: 'Devise'},
    createdAt: {type: Date, default: Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'workspace'},
});

const accountController = ({

});

const Card = new mongoose.Schema({
    card: String,
    type: String,
    cvv: Number,
    expiry: Date,
    solde: Number,
    devise: {type: mongoose.Schema.Types.ObjectId},
    createdAt: {type: Date, default: Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'workspace'}
});

const Expense = new mongoose.Schema({
    motif: {type: String},
    amount: {type: Number, default: 0},
    devise: {type: mongoose.Schema.Types.ObjectId, ref: 'Devise'},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    account: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
    createdAt: {type: Date, default: Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'workspace'}
});

const Income = new mongoose.Schema({
    motif: {type: String},
    amount: {type: Number, default: 0},
    devise: {type: mongoose.Schema.Types.ObjectId, ref: 'Devise'},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    account: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
    createdAt: {type: Date, default: Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'workspace'}
});

const Transfert = new mongoose.Schema({
    motif: String,
    amount: {type: Number, default: 0},
    devise: {type: mongoose.Schema.Types.ObjectId, ref: 'Devise'},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
    to: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
    createdAt: {type: Date, default: Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'workspace'}
});

const Category = new mongoose.Schema({
    name: {type: String, required: true},
    subs: [{type: mongoose.Schema.Types.ObjectId, ref: ''}],
    parent: {type: mongoose.Schema.Types.ObjectId, ref: ''},
    kind: [{type: String, enum: ['Expense', 'Income', 'Transfert']}]
});

const Devise = new mongoose.Schema({
    name: {type: String, required: true},
    symbol: {type: String, required: true},
    active: {type: Boolean, default: false}
});

const workspace = new mongoose.Schema({
    name: {type: String, required: true},
    members: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        scopes: [String],
        admin: {type: Boolean, default: false}
    }]
});

const history = new mongoose.Schema({
    action: String,
    data: Object,
    date: {type: Date, default: Date.now()},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'Workspace'}
});

const budget = new mongoose.Schema({
    from: {type: Date},
    to: Date,
    amount: Number,
    devise: {type: mongoose.Schema.Types.ObjectId, ref: 'Devise'},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    
});

const User =  new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    token: String,
    workspaces: [{
        workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'workspace'},
        scopes: [String],
        admin: {type: Boolean, defautl: false}
    }] //At creation create default workspace
});
