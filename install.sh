#MongoDB install

wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

sudo apt-get update

sudo apt-get install -y mongodb-org

echo "mongodb-org hold" | sudo dpkg --set-selections
echo "mongodb-org-server hold" | sudo dpkg --set-selections
echo "mongodb-org-shell hold" | sudo dpkg --set-selections
echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo "mongodb-org-tools hold" | sudo dpkg --set-selections

ps --no-headers -o comm 1

sudo systemctl daemon-reload

sudo systemctl enable mongod

sudo chown `whoami` /tmp/mongodb-27017.sock

sudo mkdir -p mongodb/data/db

sudo service start mongod

sudo mongod --dbpath=mongodb/data/db --fork --syslog

#Node Install
sudo apt install nodejs -y

sudo apt install npm -y

#NPM Install
cd xmeme
npm install