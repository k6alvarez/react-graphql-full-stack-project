const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");
const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },
  pets: forwardTo("db"),
  async users(parent, args, ctx, info) {
    // check if user has the permissions to query
    if (!ctx.request.userId) {
      throw new Error("You must be logged in");
    }
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
    //if they do, query all users
    return ctx.db.query.users({}, info);
  },
  async order(parent, args, ctx, info) {
    //make sure logged in
    if (!ctx.request.userId) {
      throw new Error("Yo arent logged in");
    }
    //query current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id }
      },
      info
    );

    //check permissions
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      "ADMIN"
    );
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error("you cant see this");
    }
    //return order
    return order;
  },
  async orders(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) throw new Error("You must be signed in");

    return ctx.db.query.orders(
      {
        where: {
          user: { id: userId }
        }
      },
      info
    );
  }
  // async pets(parent, args, ctx, info) {
  //   const pets = await ctx.db.query.pets();
  //   return pets;
  // },
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();
  //   return items;
  // }
};

module.exports = Query;
