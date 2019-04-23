FROM node:latest


COPY . /usr/src/apptodos
#Se crea y establece el directorio de la aplicación
WORKDIR /usr/src/apptodos/toDo

RUN npm install

#Copia el resto de la alicación


#Puerto por el que se enlaza la aplicación
EXPOSE 3000

CMD [ "npm", "start" ]
