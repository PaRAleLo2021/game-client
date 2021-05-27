FROM node:14 as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm update

RUN npm run build

# Create asset directory
RUN mkdir -p dist/src/assets

# Copy the images to the dist folder
COPY src/assets/* dist/src/assets/

FROM nginx:alpine as runner

WORKDIR /usr/share/nginx/html

COPY --from=builder usr/src/app/dist/* ./

# Copy the images from the source
RUN mkdir -p src/assets

COPY --from=builder /usr/src/app/src/assets/* src/assets/

EXPOSE 8080
