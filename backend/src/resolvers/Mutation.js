const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const stripe = require("../stripe");

const { promisify } = require("util");
const { hasPermission } = require("../utils");
const { transport, makeANiceEmail } = require("../mail");

const Mutations = {
  async createPet(parent, args, ctx, info) {
    const Pet = await ctx.db.mutation.createPet(
      {
        data: {
          ...args
        }
      },
      info
    );

    return Pet;
  },
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that.");
    }

    const Item = await ctx.db.mutation.createItem(
      {
        data: {
          //this is how we create a relationship between item and user
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );

    return Item;
  },
  updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id
      },
      info
    });
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    //find item
    const item = await ctx.db.query.item({ where }, `{id title user{id}}`);
    //check if they own item
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ["ADMIN", "ITEMDELETE"].includes(permission)
    );

    if (!ownsItem && !hasPermissions) {
      throw new Error("You don't have permission to do that.");
    }

    //delete item
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    //hash the password
    const password = await bcrypt.hash(args.password, 10);
    //create user in db
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["ADMIN"] }
        }
      },
      info
    );
    //create jwt token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    //set jwt as cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });

    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    //check if there is user with that email
    const user = await ctx.db.query.user({
      where: { email }
    });
    if (!user) {
      throw new Error(`No user found for ${email}`);
    }
    //check if pword is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Password");
    }
    //check jwt token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    //set cookie w/ token
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye" };
  },
  async requestReset(parent, args, ctx, info) {
    //check if real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No user found for ${args.email}`);
    }
    //reset token and expiry
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; //1 hour from now
    const response = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });
    //email the reset token
    const mailRes = await transport.sendMail({
      from: "aisha@aishagalla.com",
      to: user.email,
      subject: "Password reset token",
      html: makeANiceEmail(
        `You password reset token is here. <a href="${
          process.env.FRONTEND_URL
        }/reset?resetToken=${resetToken}">Reset Password</a>`
      )
    });

    return { message: "Success" };
  },
  async resetPassword(parent, args, ctx, info) {
    //check if passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Passwords do not match.");
    }
    //check reset token is legit and check if expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });
    if (!user) {
      throw new Error("This token is expired or invalid.");
    }
    //hash the new password
    const password = await bcrypt.hash(args.password, 10);
    //save new password
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    //generate jwt
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    //set jwt cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    //return new user
    return updatedUser;
  },
  async updatePermissions(parent, args, ctx, info) {
    //check if logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in");
    }

    // query current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );

    //check if they have permisssions to do this
    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);

    //update
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions
          }
        },
        where: {
          id: args.userId
        }
      },
      info
    );
  },
  async addToCart(parent, args, ctx, info) {
    //check if user is signed in
    const { userId } = ctx.request;

    if (!userId) {
      throw new Error("You must be signed in.");
    }
    // query user's current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    });
    //check if item is already in the cart
    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 }
        },
        info
      );
    }

    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: {
            connect: { id: userId }
          },
          item: {
            connect: { id: args.id }
          }
        }
      },
      info
    );
  },
  async removeFromCart(parent, args, ctx, info) {
    //find cart item
    const cartItem = await ctx.db.query.cartItem(
      {
        where: {
          id: args.id
        }
      },
      `{id, user{id}}`
    );
    //make sure we found an item
    if (!cartItem) {
      throw new Error("No cart item found.");
    }

    if (cartItem.user.id !== ctx.request.userId) {
      throw new Error("Nope!");
    }

    //delete that cart item
    return ctx.db.mutation.deleteCartItem(
      {
        where: { id: args.id }
      },
      info
    );
  },
  async createOrder(parent, args, ctx, info) {
    // query user and make sure they are signed in
    const { userId } = ctx.request;

    if (!userId) throw new Error("You must be signed in.");
    const user = await ctx.db.query.user(
      {
        where: { id: userId }
      },
      `{
      id
      name
      email
      cart {
        id
        quantity
        item {
          title
          price
          id
          description
          image
          largeImage
        }
      }}
    `
    );
    //recalculate total for the price
    const amount = user.cart.reduce(
      (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity,
      0
    );
    //create stripe charge
    const charge = await stripe.charges.create({
      amount,
      currency: "USD",
      source: args.token
    });
    //convert the cartitems to orderitems
    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect: { id: userId } }
      };
      delete orderItem.id;
      return orderItem;
    });
    //create order
    const order = await ctx.db.mutation.createOrder({
      data: {
        total: charge.amount,
        charge: charge.id,
        items: { create: orderItems },
        user: { connect: { id: userId } }
      }
    });
    //clean up
    const cartItemIds = user.cart.map(cartItem => cartItem.id);
    await ctx.db.mutation.deleteManyCartItems({
      where: {
        id_in: cartItemIds
      }
    });
    //return order to client
    return order;
  }
};

module.exports = Mutations;
