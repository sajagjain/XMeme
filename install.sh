wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

sudo apt-get update

sudo apt-get install -y mongodb-org

#mkdir -p data/db

#sudo systemctl unmask mongod

sudo systemctl daemon-reload

sudo systemctl enable mongod

sudo systemctl start mongodb

#sudo mongod -dbpath=$(pwd)/data/db --quiet

cd xmeme

npm start