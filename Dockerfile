FROM node:16.17.1

# diretório que irá iniciar o docker
WORKDIR /usr/src/api-smart-brain

# vai copiar, primeiro os arquivos a copiar, segundo o diretório para onde copiar
# ./ (todos os arquivos desse diretório), ./ (para o diretório onde o docker se encontra)
COPY ./ ./

# irá rodar o que deseja
# pode ter vários run
RUN npm install

# default do docker, nesse caso irá entrar no bash
CMD ["/bin/bash"]