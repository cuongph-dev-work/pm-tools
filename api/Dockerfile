FROM node:22.14-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.7.0 --activate

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json pnpm-lock.yaml ./

# Install dependencies with Yarn
RUN pnpm install --frozen-lockfile

# Install production dependencies and nodemon
RUN pnpm install --prod --frozen-lockfile

# Copy the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["pnpm", "start:dev"]