cd xmeme

export PORT=8081
export DB_CONN_STRING=mongodb://localhost/xmeme-db?retryWrites=true

sudo kill -9 `sudo lsof -t -i:$PORT`

npm start