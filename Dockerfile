ARG NODE_VERSION=latest

FROM node:${NODE_VERSION}

ENV NODE_ENV development

WORKDIR /usr/src/app

COPY package*.json ./

# This creates a persistent cache for npm packages. /root/.npm is the default npm cache directory
# By using a cache mount, subsequent builds can reuse previously downloaded packages, which speeds up the build process
# This helps avoid re-downloading packages that haven't changed
RUN --mount=type=cache,target=/root/.npm \
# npm ci (clean install) is used instead of npm install in CI/CD environments
# It's faster and more strict - it will fail if the package-lock.json doesn't match package.json
    npm install

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npx vite --port 3000 --host