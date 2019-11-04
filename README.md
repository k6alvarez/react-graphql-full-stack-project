# React and GraphQL tech stack starter project

## How to setup app for development

Before you start:
- I use Prisma for my graphQL server. You will need to set up a free dev Prisma account.
- Update the details of both `package.json` files to match your app name and description. Along with running `npm install` to update `package.lock` file details.

### Prisma (backend)

- In a terminal navigate to the `/backend` directory
- Login to Prisma (database) `prisma login`
- Delete any existing files named `prisma.yml` and `datamodel.prisma`
- Create Prisma server `prisma init` and select `Demo Server`
- Follow prompts to select server region, app name, app stage (dev or prod), and choose `Don't Generate` when asked about the programming language for the generated Prisma client
- Replace the endpoint url from the generated `prisma.yml` file and add it as the value for `PRISMA_ENDPOINT` in a new `.env` file.
- Create a `PRISMA_SECRET` variable in `.env` and set it anything, I typically use gqlAppNameSecret
- Copy and Paste the `prisma.yml.sample` to `prisma.yml`
- Copy and Paste the `datamodel.prisma.sample` to `datamodel.prisma` to generate latest schema
- Deploy to prisma with `npm run deploy`
- `npm run dev`

### React Frontend

- In a terminal navigate to the `/frontend` directory
- Run `npm install && npm run dev`
- Your app should be running at `http://localhost:7777/` and you should see the UI.
- Now you can start building your own app.

### Deployment to Heroku
- We run a single repo with two apps.
- `heroku login`
- You should get back a URL to your heroku instance along with a git url for deploying your frontend
- we use heroku remote to seperately deploy backend and frontend directories.
- `heroku apps:create my-app-name-prod`
- `git remote add heroku-backend https://git.heroku.com/my-app-name-prod`
- `git subtree push --prefix backend heroku-backend master`
- Now do the same steps for frontend
- `heroku apps:create my-app-frontend`
- `git remote add heroku-frontend https://git.heroku.com/my-app-frontend`
- `git subtree push --prefix frontend heroku-frontend master`

Congrats! You should have everything deployed, now just go into Heroku and configure your `.env` variables.

Deployment is set up with Heroku thought the use of git subtrees. One heroku instance for backend and one for frontend.
