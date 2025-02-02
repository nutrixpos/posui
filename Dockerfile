FROM node:16 AS build
WORKDIR /app

ARG VUE_APP_ZITADEL_ISSUER
ENV VUE_APP_ZITADEL_ISSUER=${VUE_APP_ZITADEL_ISSUER}

ARG VUE_APP_ZITADEL_CLIENT_ID
ENV VUE_APP_ZITADEL_CLIENT_ID=${VUE_APP_ZITADEL_CLIENT_ID}

ARG VUE_APP_ZITADEL_PROJECT_RESOURCE_ID
ENV VUE_APP_ZITADEL_PROJECT_RESOURCE_ID=${VUE_APP_ZITADEL_PROJECT_RESOURCE_ID}

ARG VUE_APP_MODULE_CORE_API_PREFIX
ENV VUE_APP_MODULE_CORE_API_PREFIX=${VUE_APP_MODULE_CORE_API_PREFIX}

ARG VUE_APP_BACKEND_HOST
ENV VUE_APP_BACKEND_HOST=${VUE_APP_BACKEND_HOST}

ARG VUE_APP_ZITADEL_REDIRECT_URL
ENV VUE_APP_ZITADEL_REDIRECT_URL=${VUE_APP_ZITADEL_REDIRECT_URL}

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]