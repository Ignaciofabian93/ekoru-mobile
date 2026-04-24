# Limpiar y regenerar

npx expo prebuild --clean --platform android

# 1. Build en la nube (solo necesitas hacerlo una vez, o cuando cambias código nativo)

eas build --profile development --platform android

# 2. Instalar la APK que te manda EAS en el celular

# 3. Correr Metro en tu PC

npx expo start

# 4. En la app del celular, ingresar tu IP local

# Ejemplo: 192.168.1.X:8081
