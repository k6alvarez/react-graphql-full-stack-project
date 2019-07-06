# React and GraphQL tech stack starter project

App Architecture needed for deployment.

1. Prisma Server

- Mysql server managed over at prisma.com
- `npm run deploy -- -n` to create new prisma service.

2. Yoga Server

- Mutation and Query Resolvers
- We run a single repo with two apps.
- `heroku login`
- `apps:create my-app-yoga-prod`
- we use heroku remote to deploy backend and frontend
- `git remote add heroku-backend https://git.heroku.com/my-app`
- `git subtree push --prefix backend heroku-backend master`
- same for frontend

3. React App

- node server running next.js

Deployemnt is set up with Heroku thought the use of git subtrees. One heroku instance for backend and one for frontend.
