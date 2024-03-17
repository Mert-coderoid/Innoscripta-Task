# Flask uygulaması için Dockerfile
FROM python:3.9-slim

# Çalışma dizinini ayarlayın
WORKDIR /app

# Bağımlılıkları yükleyin
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Spacy modelini indirin
RUN python -m spacy download en_core_web_sm

# Uygulama dosyalarını kopyalayın
COPY . .

# Uygulamayı çalıştırın
CMD ["flask", "run", "--host=0.0.0.0"]
