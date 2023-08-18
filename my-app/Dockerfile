# # Node v18 tabanlı bir image kullanalım
# FROM node:18

# # Çalışma dizinini ayarlayalım
# WORKDIR /usr/src/app

# # Uygulama kodlarını konteynıra kopyalayalım
# COPY . .

# # Bağımlılıkları yükleyelim
# RUN npm install

# EXPOSE 3000

# CMD ["npm", "start"]


# Node 18 tabanlı bir image kullanalım
FROM node:18

# Çalışma dizinini ayarlayalım
WORKDIR /usr/src/app

# Uygulama kodlarını konteynıra kopyalayalım
COPY . .

# Bağımlılıkları yükleyelim
RUN npm install

# Uygulamayı başlat
CMD ["npm", "start"]
