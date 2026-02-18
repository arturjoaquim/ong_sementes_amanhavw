# -------- STAGE 1 - Build Angular --------
FROM node:20-alpine AS build

WORKDIR /app

# Copia package.json primeiro para aproveitar cache
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Build de produção
RUN npm run build -- --configuration production


# -------- STAGE 2 - NGINX --------
FROM nginx:alpine

# Remove config padrão
RUN rm -rf /usr/share/nginx/html/*

# Copia build do Angular
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Copia config custom do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
