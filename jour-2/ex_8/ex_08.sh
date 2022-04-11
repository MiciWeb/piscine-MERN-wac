(pas sur que ce marche)

mongodump -h sample.mongodbhost.com:27042 -d mern-pool -u -p -o ~/Desktop

students.deleteMany({})

mongorestore --host sample.mongohost.com --port 27042 --username --password --db mern-pool .

 