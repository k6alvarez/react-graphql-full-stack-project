# React and GraphQL tech stack starter project

## How to setup app for development

### Prisma (backend)

- In a terminal navigate to the `/backend` directory
- Login to Prisma (database) `prisma login`
- Delete any existing files named `prisma.yml` and `datamodel.prisma`
- Create Prisma server `prisma init` and select `Demo Server`
- Follow prompts to select server region, app name, app stage (dev or prod), and choose `Don't Generate` when asked about the programming language for the generated Prisma client
- Replace the endpoint url from the generated `prisma.yml` file and add it as the value for `PRISMA_ENDPOINT` in `.env` file.
- Copy and Paste the `prisma.yml.sample` to `prisma.yml`
- Copy and Paste the `datamodel.prisma.sample` to `datamodel.prisma` to generate latest schema
- Deploy to prisma with `npm run deploy`
- `npm run dev`

### React Frontend

- In a terminal navigate to the `/frontend` directory
- Run `npm install && npm run dev`

### Deployment to Heroku
- We run a single repo with two apps.
- `heroku login`
- `apps:create my-app-name-prod`
- we use heroku remote to deploy backend and frontend
- `git remote add heroku-backend https://git.heroku.com/my-app`
- `git subtree push --prefix backend heroku-backend master`
- same for frontend

Deployemnt is set up with Heroku thought the use of git subtrees. One heroku instance for backend and one for frontend.
