FROM node:alpine as builder

WORKDIR /app

COPY package.json .

RUN npm install --force

COPY . .

RUN npm run build

# 엔진엑스를 가동하고 앞서 생성한 빌드 파일을 제공한다.
FROM nginx
EXPOSE 3000
COPY ./nginx/defualt.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html